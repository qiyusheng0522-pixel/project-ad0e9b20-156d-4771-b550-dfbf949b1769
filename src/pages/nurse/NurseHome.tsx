import { useState } from "react";
import {
  AlertTriangle, Phone, MessageSquare, CheckCircle2, Clock, Bell,
  Users, Activity, ListChecks, Sparkles, Trash2, FileCheck2, ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const initialPlans = [
  { id: 1, patient: "张伟 · 床位 0312", title: "高血压术后护理方案", level: "高优先级", items: ["每4小时测量血压", "低盐饮食宣教", "活动量监测", "服药提醒(降压药×2)"] },
  { id: 2, patient: "李娜 · 床位 0508", title: "糖尿病日常管理", level: "常规", items: ["三餐前血糖监测", "胰岛素注射记录", "足部检查", "运动方案宣教"] },
  { id: 3, patient: "王强 · 床位 0215", title: "冠心病康复护理", level: "常规", items: ["心率/血氧监测", "心理疏导", "用药依从性评估"] },
];

const NurseHome = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [generating, setGenerating] = useState(false);

  const handleAIGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const next = {
        id: Date.now(),
        patient: "陈敏 · 床位 0617",
        title: "AI 推荐 · 心律失常观察护理",
        level: "高优先级",
        items: ["持续心电监护", "每2小时记录心率", "情绪安抚", "急救药物床旁备用"],
      };
      setPlans((p) => [next, ...p]);
      setGenerating(false);
      toast({ title: "AI 已生成新方案", description: "请审核后下发执行" });
    }, 800);
  };

  const handleApproveAll = () => {
    toast({ title: `已一键审核通过 ${plans.length} 项方案`, description: "已通知执行护士" });
    setPlans([]);
  };

  const handleClearAll = () => {
    setPlans([]);
    toast({ title: "已清空全部方案", description: "您可重新让 AI 生成" });
  };

  return (
    <div className="space-y-4 p-4">
      {/* 紧急求助 */}
      <Card className="overflow-hidden border-destructive/30 bg-destructive/5">
        <div className="flex items-center justify-between border-b border-destructive/20 bg-destructive/10 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-semibold text-destructive">紧急预警 · 患者求助</span>
          </div>
          <Badge variant="destructive" className="h-5">2 条</Badge>
        </div>
        <div className="divide-y divide-destructive/15">
          <div className="p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">床位 0312 · 张伟</p>
                <p className="text-xs text-muted-foreground">血压异常飙升 · 178/108 mmHg</p>
              </div>
              <Badge variant="destructive" className="h-5 text-[10px]">危急</Badge>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <Button size="sm" variant="outline" className="h-8"><Phone className="mr-1 h-3 w-3" />医生</Button>
              <Button size="sm" variant="outline" className="h-8"><MessageSquare className="mr-1 h-3 w-3" />患者</Button>
              <Button size="sm" className="h-8 bg-destructive hover:bg-destructive/90"><CheckCircle2 className="mr-1 h-3 w-3" />一键处置</Button>
            </div>
          </div>
          <div className="p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">床位 0508 · 李娜</p>
                <p className="text-xs text-muted-foreground">求助信息 · 持续头晕</p>
              </div>
              <Badge variant="outline" className="h-5 border-warning text-[10px] text-warning">待处理</Badge>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <Button size="sm" variant="outline" className="h-8"><Phone className="mr-1 h-3 w-3" />医生</Button>
              <Button size="sm" variant="outline" className="h-8"><MessageSquare className="mr-1 h-3 w-3" />患者</Button>
              <Button size="sm" className="h-8 bg-gradient-nurse"><CheckCircle2 className="mr-1 h-3 w-3" />处置</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 今日统计 */}
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard icon={Users} label="院内患者" value="42" sub="新入 3" color="text-primary" bg="bg-primary/10" />
        <StatCard icon={Activity} label="院外随访" value="86" sub="待跟进 12" color="text-accent" bg="bg-accent/10" />
        <StatCard icon={ListChecks} label="任务完成" value="28/35" sub="80%" color="text-success" bg="bg-success/10" />
        <StatCard icon={Bell} label="预警次数" value="6" sub="今日" color="text-warning" bg="bg-warning/10" />
      </div>

      {/* 今日待办 */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold">今日待办</h3>
            <p className="text-xs text-muted-foreground">高优先级 3 · 常规 7</p>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs">全部 <ChevronRight className="ml-0.5 h-3 w-3" /></Button>
        </div>
        <div className="divide-y">
          <TodoItem level="urgent" title="患者打卡监督" desc="床位 0215 · 服药打卡逾期" />
          <TodoItem level="urgent" title="出院手续办理" desc="床位 0408 · 王芳" />
          <TodoItem level="urgent" title="逾期任务跟进" desc="3 项护理记录待补" />
          <TodoItem level="normal" title="健康宣教推送" desc="心内科患者 · 12 人" />
          <TodoItem level="normal" title="护理记录填写" desc="日间班次 · 8 项" />
          <TodoItem level="normal" title="提醒事项确认" desc="夜班交接 · 18:00" />
        </div>
      </Card>

      {/* AI 护理方案审核 */}
      <Card className="overflow-hidden">
        <div className="border-b bg-gradient-to-r from-accent/10 to-transparent px-4 py-3">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold">AI 护理方案审核</h3>
            </div>
            <Badge variant="secondary" className="h-5">{plans.length} 待审</Badge>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button size="sm" onClick={handleAIGenerate} disabled={generating} className="h-8 bg-gradient-nurse text-xs">
              <Sparkles className="mr-1 h-3 w-3" />{generating ? "生成中..." : "AI 生成"}
            </Button>
            <Button size="sm" variant="outline" onClick={handleApproveAll} disabled={!plans.length} className="h-8 border-success text-xs text-success hover:bg-success/10 hover:text-success">
              <FileCheck2 className="mr-1 h-3 w-3" />一键审核
            </Button>
            <Button size="sm" variant="outline" onClick={handleClearAll} disabled={!plans.length} className="h-8 border-destructive/40 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="mr-1 h-3 w-3" />一键清空
            </Button>
          </div>
        </div>
        {plans.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p className="mt-2 text-sm text-muted-foreground">暂无待审方案</p>
            <p className="text-xs text-muted-foreground">点击"AI 生成"开始智能推荐</p>
          </div>
        ) : (
          <div className="divide-y">
            {plans.map((p) => (
              <div key={p.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{p.patient}</p>
                  </div>
                  <Badge variant={p.level === "高优先级" ? "destructive" : "secondary"} className="h-5 shrink-0 text-[10px]">{p.level}</Badge>
                </div>
                <ul className="mt-2 space-y-1">
                  {p.items.map((it, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />{it}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 flex-1 text-xs">驳回</Button>
                  <Button size="sm" className="h-7 flex-1 bg-gradient-nurse text-xs">通过</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, sub, color, bg }: any) => (
  <Card className="p-3">
    <div className="flex items-center justify-between">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <span className="text-[10px] text-muted-foreground">{sub}</span>
    </div>
    <p className="mt-2 text-xl font-semibold">{value}</p>
    <p className="text-[11px] text-muted-foreground">{label}</p>
  </Card>
);

const TodoItem = ({ level, title, desc }: { level: "urgent" | "normal"; title: string; desc: string }) => (
  <div className="flex items-center gap-3 px-4 py-2.5">
    <div className={`h-8 w-1 shrink-0 rounded-full ${level === "urgent" ? "bg-destructive" : "bg-accent"}`} />
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm">{title}</p>
      <p className="truncate text-[11px] text-muted-foreground">{desc}</p>
    </div>
    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
  </div>
);

export default NurseHome;
