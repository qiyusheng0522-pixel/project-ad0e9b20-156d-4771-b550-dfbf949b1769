import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle, CheckCircle2, Users, Activity, Bell, ChevronRight,
  Phone, MessageSquare, ArrowUpCircle, Sparkles, ClipboardList,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import ActionSheet from "@/components/nurse/ActionSheet";

const alerts = [
  { id: 1, name: "李建国", age: 62, desc: "空腹血糖 12.8 mmol/L · 异常偏高", level: "高危" as const, source: "今晨上传" },
];

const todos = [
  { id: 1, level: "urgent" as const, title: "高血压随访", desc: "刘秀英 · 上次随访逾期 2 天", action: "去随访" },
  { id: 2, level: "normal" as const, title: "糖尿病用药复查", desc: "王建军 · 今日到期", action: "去复查" },
  { id: 3, level: "normal" as const, title: "新患者建档", desc: "医院下转 · 张伟", action: "去建档" },
];

const CommunityHome = () => {
  const navigate = useNavigate();
  const [alertSheet, setAlertSheet] = useState<typeof alerts[0] | null>(null);
  const [todoSheet, setTodoSheet] = useState<typeof todos[0] | null>(null);
  const [referSheet, setReferSheet] = useState(false);

  const handleRefer = () => {
    toast({ title: "已上转至上级医院", description: "心内科 · 王主任已接收，预计 30 分钟内回复" });
    setReferSheet(false);
  };

  return (
    <div className="space-y-3 p-3">
      {/* 异常预警 */}
      <Card className="animate-critical-pulse overflow-hidden border-2 border-destructive/60 bg-destructive/5">
        <div className="flex items-center justify-between border-b border-destructive/30 bg-destructive/15 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-semibold text-destructive">异常值预警</span>
          </div>
          <Badge variant="destructive" className="h-5 animate-pulse">{alerts.length} 高危</Badge>
        </div>
        {alerts.map((a) => (
          <div key={a.id} className="p-3">
            <div className="flex items-start gap-2">
              <span className="mt-1 h-10 w-1 shrink-0 rounded-full bg-destructive" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{a.name} · {a.age}岁</p>
                  <span className="rounded bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">{a.level}</span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-destructive">{a.desc}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{a.source}</p>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <Button size="sm" className="h-9 flex-1 bg-destructive text-sm font-semibold hover:bg-destructive/90" onClick={() => setAlertSheet(a)}>
                <CheckCircle2 className="mr-1 h-4 w-4" />立即处置
              </Button>
              <button onClick={() => setReferSheet(true)} className="flex h-9 items-center gap-1 rounded-md border border-warning bg-warning/10 px-2 text-xs font-medium text-warning hover:bg-warning/20">
                <ArrowUpCircle className="h-4 w-4" />一键上转
              </button>
            </div>
          </div>
        ))}
      </Card>

      {/* 核心数据 */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">今日工作概览</span>
          <span className="text-[10px] text-muted-foreground">↗ 较昨日</span>
        </div>
        <div className="grid grid-cols-4 divide-x">
          <button onClick={() => navigate("/community/patients")} className="flex flex-col items-center py-2.5 hover:bg-muted/40">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span className="mt-1 text-base font-bold text-primary">128</span>
            <span className="text-[10px] text-muted-foreground">在管</span>
          </button>
          <button onClick={() => navigate("/community/patients?tab=new")} className="flex flex-col items-center py-2.5 hover:bg-muted/40">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="mt-1 text-base font-bold text-accent">3</span>
            <span className="text-[10px] text-muted-foreground">新接收</span>
          </button>
          <button onClick={() => navigate("/community/vitals")} className="flex flex-col items-center py-2.5 hover:bg-muted/40">
            <Activity className="h-3.5 w-3.5 text-success" />
            <span className="mt-1 text-base font-bold text-success">15</span>
            <span className="text-[10px] text-muted-foreground">已录入</span>
          </button>
          <button onClick={() => navigate("/community/messages")} className="flex flex-col items-center py-2.5 hover:bg-muted/40">
            <Bell className="h-3.5 w-3.5 text-destructive" />
            <span className="mt-1 text-base font-bold text-destructive">4</span>
            <span className="text-[10px] text-muted-foreground">未读</span>
          </button>
        </div>
      </Card>

      {/* 今日任务看板 */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold">今日任务看板</h3>
            <Badge variant="secondary" className="h-5">{todos.length}</Badge>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate("/community/patients")}>
            全部 <ChevronRight className="ml-0.5 h-3 w-3" />
          </Button>
        </div>
        <div className="divide-y">
          {todos.map((t) => (
            <div key={t.id} className="flex items-center gap-2.5 px-4 py-2.5">
              <div className={`h-9 w-1 shrink-0 rounded-full ${t.level === "urgent" ? "bg-destructive" : "bg-accent"}`} />
              <button onClick={() => setTodoSheet(t)} className="min-w-0 flex-1 text-left">
                <div className="flex items-center gap-1.5">
                  {t.level === "urgent" && (
                    <span className="rounded bg-destructive/15 px-1 py-0.5 text-[9px] font-bold text-destructive">逾期</span>
                  )}
                  <p className="truncate text-sm">{t.title}</p>
                </div>
                <p className="truncate text-[11px] text-muted-foreground">{t.desc}</p>
              </button>
              <Button
                size="sm"
                variant={t.level === "urgent" ? "default" : "outline"}
                className={`h-7 px-2 text-[11px] ${t.level === "urgent" ? "bg-destructive hover:bg-destructive/90" : ""}`}
                onClick={() => setTodoSheet(t)}
              >
                {t.action}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* 快捷入口 */}
      <Card className="overflow-hidden">
        <div className="border-b px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">快捷操作</span>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          <Button variant="outline" className="h-12 justify-start text-xs" onClick={() => navigate("/community/vitals")}>
            <Activity className="mr-2 h-4 w-4 text-accent" />血糖 / 血压录入
          </Button>
          <Button variant="outline" className="h-12 justify-start text-xs" onClick={() => setReferSheet(true)}>
            <ArrowUpCircle className="mr-2 h-4 w-4 text-warning" />一键上转医院
          </Button>
        </div>
      </Card>

      {/* ===== Sheets ===== */}
      <ActionSheet
        open={!!alertSheet}
        onOpenChange={(v) => !v && setAlertSheet(null)}
        title="异常处置"
        description={alertSheet ? `${alertSheet.name} · ${alertSheet.age}岁` : ""}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setAlertSheet(null)}>稍后处理</Button>
            <Button className="bg-gradient-community" onClick={() => { toast({ title: "已记录处置" }); setAlertSheet(null); }}>
              确认处置
            </Button>
          </div>
        }
      >
        {alertSheet && (
          <div className="space-y-3 py-2">
            <div className="rounded-lg bg-destructive/5 p-3 text-xs">
              <p className="font-medium text-destructive">{alertSheet.desc}</p>
              <p className="mt-1 text-muted-foreground">{alertSheet.source}</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">建议处置</p>
              <ul className="space-y-1.5 text-xs">
                {["电话联系患者复测", "通知家属陪同就诊", "记录处置结果", "如持续异常一键上转"].map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/15 text-[10px] text-accent">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs"><Phone className="mr-1 h-3 w-3" />联系</Button>
              <Button variant="outline" size="sm" className="h-8 text-xs"><MessageSquare className="mr-1 h-3 w-3" />消息</Button>
              <Button size="sm" className="h-8 bg-warning text-xs hover:bg-warning/90" onClick={() => { setAlertSheet(null); setReferSheet(true); }}>
                <ArrowUpCircle className="mr-1 h-3 w-3" />上转
              </Button>
            </div>
          </div>
        )}
      </ActionSheet>

      <ActionSheet
        open={!!todoSheet}
        onOpenChange={(v) => !v && setTodoSheet(null)}
        title={todoSheet?.title ?? ""}
        description={todoSheet?.desc}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setTodoSheet(null)}>稍后</Button>
            <Button className="bg-gradient-community" onClick={() => { toast({ title: "已开始任务", description: todoSheet?.title }); setTodoSheet(null); }}>
              {todoSheet?.action}
            </Button>
          </div>
        }
      >
        <div className="space-y-2 py-2 text-xs text-muted-foreground">
          <p>任务详情:{todoSheet?.desc}</p>
          <p>建议在今日完成,逾期将自动上报。</p>
        </div>
      </ActionSheet>

      <ActionSheet
        open={referSheet}
        onOpenChange={setReferSheet}
        title="一键上转医院"
        description="将患者档案与近 7 日数据推送至上级医院"
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setReferSheet(false)}>取消</Button>
            <Button className="bg-warning hover:bg-warning/90" onClick={handleRefer}>
              <ArrowUpCircle className="mr-1 h-4 w-4" />确认上转
            </Button>
          </div>
        }
      >
        <div className="space-y-3 py-2 text-xs">
          <div className="rounded-lg bg-muted/40 p-3">
            <p className="font-medium">接收医院</p>
            <p className="mt-1 text-muted-foreground">市第一人民医院 · 心内科</p>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <p className="font-medium">推送内容</p>
            <ul className="mt-1 space-y-1 text-muted-foreground">
              <li>· 患者基础档案</li>
              <li>· 近 7 日血压 / 血糖记录</li>
              <li>· 用药情况</li>
              <li>· 本次异常说明</li>
            </ul>
          </div>
        </div>
      </ActionSheet>
    </div>
  );
};

export default CommunityHome;
