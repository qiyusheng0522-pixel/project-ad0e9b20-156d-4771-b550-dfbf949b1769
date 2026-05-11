import { useNavigate } from "react-router-dom";
import {
  Users, MessageSquare, BookOpen, LogOut as LogOutIcon, Activity,
  Syringe, Droplet, ClipboardCheck, Clock, AlertTriangle, ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const NurseHome = () => {
  const navigate = useNavigate();

  const todoItems = [
    {
      key: "patients", icon: Users, label: "患者", sub: "在管 · 内分泌科",
      count: 28, unit: "在期", color: "text-primary", bg: "bg-primary/10",
      to: "/nurse/patients",
    },
    {
      key: "chat", icon: MessageSquare, label: "待回复", sub: "患者/医生消息",
      count: 5, unit: "条未读", color: "text-success", bg: "bg-success/10",
      to: "/nurse/chat",
    },
    {
      key: "education", icon: BookOpen, label: "待宣教内容", sub: "胰岛素注射/低糖饮食",
      count: 9, unit: "条待推送", color: "text-warning", bg: "bg-warning/10",
      to: "/nurse/education",
    },
    {
      key: "handover", icon: LogOutIcon, label: "出院转交", sub: "下转社区 / 居家护理",
      count: 3, unit: "条待交接", color: "text-primary", bg: "bg-primary/10",
      to: "/nurse/handover",
    },
  ];

  const pendingTotal = todoItems.reduce((a, b) => a + b.count, 0);

  return (
    <div className="space-y-3 p-4">
      {/* 问候 */}
      <Card className="bg-gradient-nurse p-4 text-primary-foreground shadow-soft">
        <h2 className="text-base font-semibold">李护士,早上好 👋</h2>
        <p className="mt-0.5 text-[11px] opacity-90">内分泌科 · 今日 {pendingTotal} 项待处理</p>
      </Card>

      {/* 待办卡片网格 */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">今日待办</h3>
        </div>
        <Badge variant="secondary" className="h-5">共 {pendingTotal} 项</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {todoItems.map((t) => (
          <button
            key={t.key}
            onClick={() => navigate(t.to)}
            className="group relative flex items-center justify-between rounded-2xl border bg-card p-3.5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="min-w-0 flex-1">
              <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${t.bg}`}>
                <t.icon className={`h-5 w-5 ${t.color}`} />
              </div>
              <p className="text-[13px] font-medium text-foreground">{t.label}</p>
              <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{t.sub}</p>
            </div>
            <div className="ml-2 flex shrink-0 flex-col items-end">
              <span className={`text-2xl font-bold leading-none ${t.color}`}>{t.count}</span>
              <span className="mt-1 text-[10px] text-muted-foreground">{t.unit}</span>
            </div>
          </button>
        ))}
      </div>

      {/* 我的工作任务 */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div className="flex items-center gap-1.5">
          <ClipboardCheck className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">任务列表</h3>
        </div>
        <span className="text-[10px] text-muted-foreground">按时间排序</span>
      </div>
      <Card className="overflow-hidden">
        <div className="divide-y">
          {[
            { time: "08:30", title: "三餐前胰岛素注射", patient: "张伟 · 床 0312", icon: Syringe, tone: "primary", urgent: true, sub: "门冬胰岛素 8U" },
            { time: "09:00", title: "空腹血糖监测", patient: "李娜 · 床 0508", icon: Droplet, tone: "warning", urgent: true, sub: "目标 4.4-7.0 mmol/L" },
            { time: "10:00", title: "执行医生健康方案", patient: "周婷 · 床 0305", icon: ClipboardCheck, tone: "accent", sub: "王主任 · 妊娠糖尿病方案待执行" },
            { time: "11:00", title: "甲亢健康宣教", patient: "王强 · 床 0215", icon: BookOpen, tone: "primary", sub: "低碘饮食 / 服药指导" },
            { time: "14:00", title: "出院转交-社区", patient: "陈敏 · 床 0617", icon: LogOutIcon, tone: "success", sub: "下转鼓楼社区卫生站" },
            { time: "15:30", title: "心率异常复测", patient: "王强 · 床 0215", icon: AlertTriangle, tone: "destructive", urgent: true, sub: "上次 128 bpm" },
          ].map((t, i) => {
            const toneMap: Record<string, { bg: string; fg: string }> = {
              primary: { bg: "bg-primary/10", fg: "text-primary" },
              warning: { bg: "bg-warning/10", fg: "text-warning" },
              accent: { bg: "bg-accent/10", fg: "text-accent" },
              success: { bg: "bg-success/10", fg: "text-success" },
              destructive: { bg: "bg-destructive/10", fg: "text-destructive" },
            };
            const c = toneMap[t.tone];
            return (
              <button
                key={i}
                onClick={() => navigate("/nurse/patients")}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/40"
              >
                <div className="flex w-12 shrink-0 flex-col items-center">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="mt-0.5 text-[11px] font-semibold tabular-nums">{t.time}</span>
                </div>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${c.bg}`}>
                  <t.icon className={`h-4 w-4 ${c.fg}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[13px] font-medium">{t.title}</span>
                    {t.urgent && <Badge variant="destructive" className="h-3.5 px-1 text-[9px]">紧急</Badge>}
                  </div>
                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{t.patient} · {t.sub}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default NurseHome;
