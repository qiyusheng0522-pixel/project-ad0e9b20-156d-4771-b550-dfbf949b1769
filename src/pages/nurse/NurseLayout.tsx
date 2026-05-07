import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, FileText, User as UserIcon, ClipboardCheck, ArrowLeft, Bell, Wifi, Signal, BatteryFull } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const tabs = [
  { to: "/nurse", icon: Home, label: "工作台", end: true },
  { to: "/nurse/tasks", icon: ClipboardCheck, label: "任务" },
  { to: "/nurse/chat", icon: MessageSquare, label: "沟通" },
  { to: "/nurse/plans", icon: FileText, label: "方案" },
  { to: "/nurse/profile", icon: UserIcon, label: "我的" },
];

const titleMap: Record<string, string> = {
  "/nurse": "工作台",
  "/nurse/tasks": "任务监控",
  "/nurse/handover": "出院转交",
  "/nurse/education": "宣教管理",
  "/nurse/chat": "沟通",
  "/nurse/plans": "护理方案",
  "/nurse/profile": "我的",
};

const NurseLayout = () => {
  const location = useLocation();
  const isFullscreenChild = location.pathname.startsWith("/nurse/chat/");
  const title = titleMap[location.pathname] ?? "工作台";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 px-4 py-6 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto" style={{ width: 408 }}>
        <div className="phone-shell">
          <span className="phone-side-left" />
          <div data-nurse-frame className="phone-screen relative flex flex-col" style={{ height: 820 }}>
            <div className="phone-notch" />
            <div className="phone-statusbar">
              <span>9:41</span>
              <span className="flex items-center gap-1.5 text-foreground/80">
                <Signal className="h-3.5 w-3.5" />
                <Wifi className="h-3.5 w-3.5" />
                <BatteryFull className="h-3.5 w-3.5" />
              </span>
            </div>

            {!isFullscreenChild && (
              <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-card px-4 py-3">
                <Link to="/" className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-base font-semibold">{title}</h1>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toast({ title: "您有 3 条未读通知", description: "请前往工作台查看预警详情" })}
                    className="relative rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-destructive" />
                  </button>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-nurse text-xs font-semibold text-primary-foreground">
                    李
                  </div>
                </div>
              </header>
            )}

            <main className={`flex-1 overflow-y-auto ${isFullscreenChild ? "" : "pb-16"}`}>
              <Outlet />
            </main>

            {!isFullscreenChild && (
              <nav className="absolute bottom-0 left-0 right-0 z-40 border-t bg-card/95 backdrop-blur-md">
                <div className="grid grid-cols-5">
                  {tabs.map((t) => (
                    <NavLink
                      key={t.to}
                      to={t.to}
                      end={t.end}
                      className={({ isActive }) =>
                        `flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] transition-colors ${
                          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        }`
                      }
                    >
                      <t.icon className="h-5 w-5" />
                      <span>{t.label}</span>
                    </NavLink>
                  ))}
                </div>
                <div className="flex justify-center pb-1.5 pt-1">
                  <span className="h-1 w-24 rounded-full bg-foreground/40" />
                </div>
              </nav>
            )}
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">护士端小程序 · 移动端预览 (iPhone 15)</p>
      </div>
    </div>
  );
};

export default NurseLayout;
