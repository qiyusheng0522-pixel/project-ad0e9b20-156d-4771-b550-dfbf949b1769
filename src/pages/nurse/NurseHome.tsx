import { useNavigate } from "react-router-dom";
import {
  Users, MessageSquare, BookOpen, LogOut as LogOutIcon, Activity,
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
    </div>
  );
};

export default NurseHome;
