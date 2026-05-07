import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, FileCheck2, AlertTriangle, MessageSquare, BookOpen, LogOut as LogOutIcon,
  ChevronRight, Wallet, Activity,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const NurseHome = () => {
  const navigate = useNavigate();

  // 5 个待办（按指定顺序）+ 出院转交
  const todoItems = [
    {
      key: "patients",
      icon: Users,
      label: "患者",
      sub: "在管 · 内分泌科",
      count: 28,
      unit: "在期",
      color: "text-primary",
      bg: "bg-primary/10",
      to: "/nurse/patients",
    },
    {
      key: "plans",
      icon: FileCheck2,
      label: "护理方案",
      sub: "AI 推荐待审核",
      count: 6,
      unit: "条待审",
      color: "text-accent",
      bg: "bg-accent/10",
      to: "/nurse/plans",
    },
    {
      key: "alerts",
      icon: AlertTriangle,
      label: "风险预警",
      sub: "血糖/血压异常",
      count: 4,
      unit: "条待处理",
      color: "text-destructive",
      bg: "bg-destructive/10",
      to: "/nurse/patients?filter=异常",
    },
    {
      key: "chat",
      icon: MessageSquare,
      label: "待回复",
      sub: "患者/医生消息",
      count: 5,
      unit: "条未读",
      color: "text-success",
      bg: "bg-success/10",
      to: "/nurse/chat",
    },
    {
      key: "education",
      icon: BookOpen,
      label: "待宣教内容",
      sub: "胰岛素注射/低糖饮食",
      count: 9,
      unit: "条待推送",
      color: "text-warning",
      bg: "bg-warning/10",
      to: "/nurse/education",
    },
    {
      key: "handover",
      icon: LogOutIcon,
      label: "出院转交",
      sub: "下转社区 / 居家护理",
      count: 3,
      unit: "条待交接",
      color: "text-primary",
      bg: "bg-primary/10",
      to: "/nurse/handover",
    },
  ];

  const pendingTotal = todoItems.reduce((a, b) => a + b.count, 0);

  // 紧急关注（内分泌）
  const alerts = [
    { name: "张伟", bed: "0312", desc: "随机血糖 16.8 mmol/L · 警惕 DKA", level: "紧急", tone: "destructive" as const, time: "10 分钟前" },
    { name: "李娜", bed: "0508", desc: "连续 3 日空腹血糖 > 9.0 mmol/L", level: "警告", tone: "warning" as const, time: "1 小时前" },
    { name: "王强", bed: "0215", desc: "甲亢 · 心率 128 bpm,持续偏快", level: "提醒", tone: "primary" as const, time: "3 小时前" },
  ];
  const toneMap = {
    destructive: { dot: "bg-destructive/15", icon: "text-destructive", tag: "bg-destructive/15 text-destructive" },
    warning: { dot: "bg-warning/15", icon: "text-warning", tag: "bg-warning/15 text-warning" },
    primary: { dot: "bg-primary/15", icon: "text-primary", tag: "bg-primary/15 text-primary" },
  };

  return (
    <div className="space-y-3 p-4">
      {/* 问候 + 收益 */}
      <Card className="bg-gradient-nurse p-4 text-primary-foreground shadow-soft">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold">李护士,早上好 👋</h2>
            <p className="mt-0.5 text-[11px] opacity-90">内分泌科 · 今日 {pendingTotal} 项待处理</p>
          </div>
          <button onClick={() => navigate("/nurse/profile")} className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[10px] hover:bg-white/25">
            <Wallet className="h-3 w-3" />收益明细
          </button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/20 pt-3">
          <div>
            <p className="text-[10px] opacity-80">本月收益</p>
            <p className="mt-0.5 text-lg font-bold">¥8,640</p>
          </div>
          <div>
            <p className="text-[10px] opacity-80">完成单数</p>
            <p className="mt-0.5 text-lg font-bold">86</p>
          </div>
          <div>
            <p className="text-[10px] opacity-80">待结算</p>
            <p className="mt-0.5 text-lg font-bold">¥1,280</p>
          </div>
        </div>
      </Card>

      {/* 待办数量卡片 - 按指定顺序 */}
      <Card className="overflow-hidden shadow-soft">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">今日待办</h3>
          </div>
          <Badge variant="secondary" className="h-5">{todoItems.length} 项</Badge>
        </div>
        <div className="divide-y">
          {todoItems.map((t) => (
            <button
              key={t.key}
              onClick={() => navigate(t.to)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${t.bg}`}>
                <t.icon className={`h-5 w-5 ${t.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{t.label}</p>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{t.sub}</p>
              </div>
              <div className="flex shrink-0 items-baseline gap-1">
                <span className={`text-xl font-bold ${t.color}`}>{t.count}</span>
                <span className="text-[10px] text-muted-foreground">{t.unit}</span>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </Card>

      {/* 紧急关注 */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h3 className="text-sm font-semibold">紧急关注</h3>
          </div>
          <button onClick={() => navigate("/nurse/patients?filter=异常")} className="flex items-center text-xs text-primary">
            查看全部 <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="divide-y">
          {alerts.map((a) => {
            const t = toneMap[a.tone];
            return (
              <div key={a.name} className="flex items-start gap-3 px-4 py-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${t.dot}`}>
                  <AlertTriangle className={`h-4 w-4 ${t.icon}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold">{a.name}</span>
                    <span className="text-[10px] text-muted-foreground">床 {a.bed}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${t.tag}`}>{a.level}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{a.desc}</p>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">{a.time}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default NurseHome;
