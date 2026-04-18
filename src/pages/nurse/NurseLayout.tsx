import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { Home, ClipboardCheck, LogOut as LogOutIcon, BookOpen, ArrowLeft, Bell, HeartPulse } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const tabs = [
  { to: "/nurse", icon: Home, label: "工作台", end: true },
  { to: "/nurse/tasks", icon: ClipboardCheck, label: "任务监控" },
  { to: "/nurse/handover", icon: LogOutIcon, label: "出院转交" },
  { to: "/nurse/education", icon: BookOpen, label: "宣教管理" },
];

const NurseLayout = () => {
  const location = useLocation();
  // 进入二级页(如会话)时隐藏顶栏与底部 tab,让二级页拥有完整框内空间
  const isFullscreenChild = location.pathname.startsWith("/nurse/chat");

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile-first frame — relative 作为弹窗定位上下文 */}
      <div
        data-nurse-frame
        className="relative mx-auto flex min-h-screen max-w-[480px] flex-col overflow-hidden bg-background shadow-card"
      >
        {/* Top bar */}
        {!isFullscreenChild && (
          <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-gradient-nurse px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Link to="/" className="rounded p-1 hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                <HeartPulse className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">护士工作站</p>
                <p className="text-[11px] opacity-80">心内科 · 李护士</p>
              </div>
            </div>
            <button
              onClick={() => toast({ title: "您有 3 条未读通知", description: "请前往工作台查看预警详情" })}
              className="relative rounded-full p-1.5 hover:bg-white/10"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-warning" />
            </button>
          </header>
        )}

        {/* Page content */}
        <main className={`flex-1 overflow-y-auto ${isFullscreenChild ? "" : "pb-20"}`}>
          <Outlet />
        </main>

        {/* Bottom tab bar — 只在主页面显示 */}
        {!isFullscreenChild && (
          <nav className="absolute bottom-0 left-0 right-0 z-40 border-t bg-card/95 backdrop-blur-md">
            <div className="grid grid-cols-4">
              {tabs.map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  end={t.end}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] transition-colors ${
                      isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
                    }`
                  }
                >
                  <t.icon className="h-5 w-5" />
                  <span>{t.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default NurseLayout;
