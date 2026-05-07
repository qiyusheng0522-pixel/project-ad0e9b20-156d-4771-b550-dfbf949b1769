import { useState } from "react";
import { Sparkles, FileCheck2, ChevronRight, CheckCircle2, AlertTriangle, ClipboardList, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import ActionSheet from "@/components/nurse/ActionSheet";

type Status = "pending" | "approved" | "rejected";
type Plan = {
  id: number;
  patient: string;
  bed: string;
  diagnosis: string;
  level: "高优先级" | "常规";
  status: Status;
  items: { text: string; risk: "ok" | "warn"; freq: string; note?: string }[];
};

const initial: Plan[] = [
  {
    id: 1, patient: "张伟", bed: "0312", diagnosis: "高血压 III 级 · 冠心病", level: "高优先级", status: "pending",
    items: [
      { text: "血压监测", freq: "每 4 小时", risk: "ok", note: "符合 JNC 8 规范" },
      { text: "低盐饮食宣教", freq: "每日", risk: "ok" },
      { text: "降压药打卡", freq: "每日 2 次", risk: "warn", note: "建议补充服药间隔" },
    ],
  },
  {
    id: 2, patient: "李娜", bed: "0508", diagnosis: "2 型糖尿病", level: "常规", status: "pending",
    items: [
      { text: "空腹血糖记录", freq: "每日 1 次", risk: "ok" },
      { text: "餐后血糖记录", freq: "每日 3 次", risk: "ok" },
      { text: "胰岛素注射指导", freq: "每周 2 次", risk: "ok" },
    ],
  },
  {
    id: 3, patient: "王强", bed: "0215", diagnosis: "心律失常", level: "高优先级", status: "pending",
    items: [
      { text: "持续心电监护", freq: "24h", risk: "ok" },
      { text: "心率记录", freq: "每 2 小时", risk: "warn", note: "建议增加血氧记录" },
      { text: "急救药床旁备用", freq: "持续", risk: "ok" },
    ],
  },
  {
    id: 4, patient: "陈敏", bed: "0617", diagnosis: "术后康复", level: "常规", status: "approved",
    items: [
      { text: "切口换药", freq: "每日 1 次", risk: "ok" },
      { text: "康复活动指导", freq: "每日 2 次", risk: "ok" },
    ],
  },
];

const NursePlans = () => {
  const [plans, setPlans] = useState(initial);
  const [tab, setTab] = useState<"pending" | "approved">("pending");
  const [detail, setDetail] = useState<Plan | null>(null);
  const [genTodos, setGenTodos] = useState<{ patient: string; items: string[] } | null>(null);

  const filtered = plans.filter((p) => (tab === "pending" ? p.status === "pending" : p.status === "approved"));

  const approve = (p: Plan) => {
    setPlans((all) => all.map((x) => (x.id === p.id ? { ...x, status: "approved" } : x)));
    setDetail(null);
    setGenTodos({ patient: `${p.patient} · 床 ${p.bed}`, items: p.items.map((i) => `${i.text} (${i.freq})`) });
    toast({ title: "护理方案已通过审核", description: `已为 ${p.patient} 自动生成 ${p.items.length} 条执行待办` });
  };

  const reject = (p: Plan) => {
    setPlans((all) => all.map((x) => (x.id === p.id ? { ...x, status: "rejected" } : x)));
    setDetail(null);
    toast({ title: "已驳回方案", description: p.patient });
  };

  return (
    <div className="space-y-3 p-4">
      {/* 概览 */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "待审核", value: plans.filter((p) => p.status === "pending").length, color: "text-warning", bg: "bg-warning/10" },
          { label: "已通过", value: plans.filter((p) => p.status === "approved").length, color: "text-success", bg: "bg-success/10" },
          { label: "高优先级", value: plans.filter((p) => p.level === "高优先级").length, color: "text-destructive", bg: "bg-destructive/10" },
        ].map((s) => (
          <Card key={s.label} className={`p-3 text-center shadow-soft`}>
            <div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}>
              <FileText className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="mt-2 text-xl font-bold">{s.value}</p>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* AI 生成提示 */}
      <Card className="bg-gradient-to-r from-accent/10 to-primary/10 p-3 shadow-soft">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <p className="flex-1 text-xs">所有患者均需先审核护理方案，通过后自动生成执行待办</p>
          <Button size="sm" className="h-7 bg-gradient-nurse text-xs" onClick={() => toast({ title: "AI 已重新生成方案" })}>
            AI 生成
          </Button>
        </div>
      </Card>

      {/* Tab */}
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
        {(["pending", "approved"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-md py-1.5 text-sm font-medium transition-all ${tab === k ? "bg-card shadow-soft" : "text-muted-foreground"}`}
          >
            {k === "pending" ? "待审核" : "已生效"}
          </button>
        ))}
      </div>

      {/* 列表 */}
      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">暂无方案</div>
        ) : (
          <div className="divide-y">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setDetail(p)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${p.level === "高优先级" ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary"}`}>
                  {p.bed}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold">{p.patient}</span>
                    <Badge variant={p.level === "高优先级" ? "destructive" : "secondary"} className="h-4 px-1 text-[9px]">{p.level}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{p.diagnosis}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{p.items.length} 项护理项 · {p.items.filter((i) => i.risk === "warn").length} 项需关注</p>
                </div>
                {p.status === "pending" ? (
                  <Badge variant="outline" className="h-5 border-warning text-[10px] text-warning">待审核</Badge>
                ) : (
                  <Badge variant="outline" className="h-5 border-success text-[10px] text-success">已生效</Badge>
                )}
                <ChevronRight className="ml-1 h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* 方案详情 */}
      <ActionSheet
        open={!!detail}
        onOpenChange={(v) => !v && setDetail(null)}
        title={detail ? `${detail.patient} · 护理方案` : ""}
        description={detail ? `床 ${detail.bed} · ${detail.diagnosis}` : ""}
        footer={
          detail?.status === "pending" ? (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => detail && reject(detail)}>驳回</Button>
              <Button className="bg-gradient-nurse" onClick={() => detail && approve(detail)}>
                <FileCheck2 className="mr-1 h-4 w-4" />通过并生成待办
              </Button>
            </div>
          ) : (
            <Button className="w-full" variant="outline" onClick={() => setDetail(null)}>关闭</Button>
          )
        }
      >
        {detail && (
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              {detail.items.map((it, i) => (
                <div key={i} className="rounded-lg border bg-card p-2.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${it.risk === "warn" ? "bg-warning" : "bg-success"}`} />
                    <span className="flex-1 font-medium">{it.text}</span>
                    <span className="text-[10px] text-muted-foreground">{it.freq}</span>
                  </div>
                  {it.note && (
                    <p className={`mt-1 rounded px-1.5 py-0.5 text-[10px] ${it.risk === "warn" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>
                      {it.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {detail.status === "pending" && <Textarea placeholder="审核备注(可选)" className="min-h-[50px] text-xs" />}
          </div>
        )}
      </ActionSheet>

      {/* 生成待办成功 */}
      <ActionSheet
        open={!!genTodos}
        onOpenChange={(v) => !v && setGenTodos(null)}
        title="已生成执行待办"
        description={genTodos?.patient}
        footer={
          <Button className="w-full bg-gradient-nurse" onClick={() => setGenTodos(null)}>
            <CheckCircle2 className="mr-1 h-4 w-4" />知道了
          </Button>
        }
      >
        {genTodos && (
          <div className="space-y-2 py-2">
            <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-xs">
              <ClipboardList className="h-4 w-4 text-success" />
              <span>已为该患者自动生成 {genTodos.items.length} 条执行待办，可在【任务】中查看。</span>
            </div>
            {genTodos.items.map((t, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border bg-card p-2 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        )}
      </ActionSheet>
    </div>
  );
};

export default NursePlans;
