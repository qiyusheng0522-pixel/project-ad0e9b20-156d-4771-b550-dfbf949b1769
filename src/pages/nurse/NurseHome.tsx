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

      {/* 今日待办清单 */}
      {(() => {
        const tasks = [
          { patientId: 4, type: "宣教", priority: "紧急", bed: "0617", name: "陈敏", sub: "出院饮食指导 · 09:00" },
          { patientId: 2, type: "沟通", priority: "紧急", bed: "0508", name: "李娜", sub: "回复用药咨询 · 10:00" },
          { patientId: 3, type: "宣教", priority: "重要", bed: "0215", name: "王强", sub: "低碘饮食宣教 · 11:00" },
          { patientId: 1, type: "沟通", priority: "重要", bed: "0312", name: "张伟", sub: "随访血糖记录 · 13:30" },
          { patientId: 4, type: "出院转交", priority: "普通", bed: "0617", name: "陈敏", sub: "下转鼓楼社区卫生站 · 14:00" },
          { patientId: 6, type: "出院转交", priority: "普通", bed: "0305", name: "周婷", sub: "下转兰园社区 · 16:00" },
        ];
        const typeStyle: Record<string, string> = {
          "宣教": "bg-accent/10 text-accent",
          "沟通": "bg-primary/10 text-primary",
          "出院转交": "bg-success/10 text-success",
        };
        const priorityStyle: Record<string, string> = {
          "紧急": "bg-destructive/10 text-destructive",
          "重要": "bg-warning/15 text-warning",
          "普通": "bg-muted text-muted-foreground",
        };
        return (
          <>
            <div className="flex items-center justify-between px-1 pt-2">
              <div className="flex items-center gap-1.5">
                <ClipboardCheck className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">今日待办清单</h3>
              </div>
              <span className="text-[10px] text-muted-foreground">共 {tasks.length} 项 · 按优先级</span>
            </div>
            <Card className="overflow-hidden">
              <div className="divide-y">
                {tasks.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(`/nurse/patients/${t.patientId}`)}
                    className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/40"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${typeStyle[t.type] ?? "bg-muted text-muted-foreground"}`}>
                          {t.type}
                        </span>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${priorityStyle[t.priority]}`}>
                          {t.priority}
                        </span>
                        <span className="text-[13px] font-semibold">{t.bed} {t.name}</span>
                      </div>
                      <p className="mt-1 truncate text-[11px] text-muted-foreground">{t.sub}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </Card>
          </>
        );
      })()}
    </div>
  );
};

export default NurseHome;
