import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, MessageSquare, ArrowUpCircle, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ActionSheet from "@/components/nurse/ActionSheet";
import { toast } from "@/hooks/use-toast";

const CommunityHome = () => {
  const navigate = useNavigate();
  const [referSheet, setReferSheet] = useState(false);

  const todoItems = [
    {
      key: "patients", icon: Users, label: "患者档案", sub: "在管 · 朝阳社区",
      count: 128, unit: "在管", color: "text-primary", bg: "bg-primary/10",
      to: "/community/patients",
    },
    {
      key: "education", icon: BookOpen, label: "宣教", sub: "高血压/糖尿病管理",
      count: 6, unit: "条待推送", color: "text-warning", bg: "bg-warning/10",
      to: "/community/education",
    },
    {
      key: "chat", icon: MessageSquare, label: "沟通", sub: "患者/上级医生",
      count: 4, unit: "条未读", color: "text-success", bg: "bg-success/10",
      to: "/community/messages",
    },
    {
      key: "refer", icon: ArrowUpCircle, label: "上转鼓楼", sub: "南京市鼓楼医院 · 内分泌科",
      count: 2, unit: "条待上转", color: "text-destructive", bg: "bg-destructive/10",
      action: () => setReferSheet(true),
    },
  ];

  const total = todoItems.reduce((a, b) => a + b.count, 0);

  return (
    <div className="space-y-3 p-4">
      <Card className="bg-gradient-community p-4 text-primary-foreground shadow-soft">
        <h2 className="text-base font-semibold">张医生,早上好 👋</h2>
        <p className="mt-0.5 text-[11px] opacity-90">朝阳社区卫生站 · 对接南京市鼓楼医院 · 内分泌科</p>
      </Card>

      <div className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-1.5">
          <Activity className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold">今日待办</h3>
        </div>
        <Badge variant="secondary" className="h-5">共 {total} 项</Badge>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {todoItems.map((t) => (
          <button
            key={t.key}
            onClick={() => (t.to ? navigate(t.to) : t.action?.())}
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

      <ActionSheet
        open={referSheet}
        onOpenChange={setReferSheet}
        title="上转鼓楼医院"
        description="将患者档案与近 7 日数据推送至南京市鼓楼医院 · 内分泌科"
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setReferSheet(false)}>取消</Button>
            <Button className="bg-gradient-community" onClick={() => { toast({ title: "已上转", description: "南京市鼓楼医院内分泌科 · 王主任已接收" }); setReferSheet(false); }}>
              <ArrowUpCircle className="mr-1 h-4 w-4" />确认上转
            </Button>
          </div>
        }
      >
        <div className="space-y-3 py-2 text-xs">
          <div className="rounded-lg bg-muted/40 p-3">
            <p className="font-medium">接收科室</p>
            <p className="mt-1 text-muted-foreground">南京市鼓楼医院 · 内分泌科</p>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <p className="font-medium">推送内容</p>
            <ul className="mt-1 space-y-1 text-muted-foreground">
              <li>· 患者基础档案</li>
              <li>· 近 7 日血压 / 血糖记录</li>
              <li>· 用药与过敏史</li>
              <li>· 本次上转说明</li>
            </ul>
          </div>
        </div>
      </ActionSheet>
    </div>
  );
};

export default CommunityHome;
