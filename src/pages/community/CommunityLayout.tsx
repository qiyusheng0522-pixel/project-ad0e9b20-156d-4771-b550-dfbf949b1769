import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { Home, Users, Activity, Bell, ArrowLeft, Stethoscope, Wifi, Signal, BatteryFull } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const tabs = [
  { to: "/community", icon: Home, label: "工作台", end: true },
  { to: "/community/patients", icon: Users, label: "患者档案" },
  { to: "/community/vitals", icon: Activity, label: "数据录入" },
  { to: "/community/messages", icon: Bell, label: "消息" },
];

const CommunityLayout = () => {
  const location = useLocation();
  const isFullscreenChild = location.pathname.startsWith("/community/chat");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 px-4 py-6 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto" style={{ width: 408 }}>
        <div className="phone-shell">
          <span className="phone-side-left" />
          <div data-community-frame className="phone-screen relative flex flex-col" style={{ height: 820 }}>
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
              <header className="sticky top-0 z-30 flex items-center justify-between bg-gradient-community px-4 py-3 text-primary-foreground">
                <div className="flex items-center gap-2">
                  <Link to="/" className="rounded p-1 hover:bg-white/10">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold">社区卫生站</p>
                    <p className="text-[11px] opacity-80">朝阳社区 · 张医生</p>
                  </div>
                </div>
                <button
                  onClick={() => toast({ title: "您有 4 条新消息", description: "请前往消息中心查看" })}
                  className="relative rounded-full p-1.5 hover:bg-white/10"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-warning" />
                </button>
              </header>
            )}

            <main className={`flex-1 overflow-y-auto ${isFullscreenChild ? "" : "pb-16"}`}>
              <Outlet />
            </main>

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
                <div className="flex justify-center pb-1.5 pt-1">
                  <span className="h-1 w-24 rounded-full bg-foreground/40" />
                </div>
              </nav>
            )}
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">社区端小程序 · 移动端预览 (iPhone 15)</p>
      </div>
    </div>
  );
};

export default CommunityLayout;
