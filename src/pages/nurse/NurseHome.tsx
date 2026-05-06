import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle, Phone, MessageSquare, CheckCircle2, Clock, Bell,
  Users, Activity, ListChecks, Sparkles, Trash2, FileCheck2, ChevronRight, X,
  Camera, Mic, FileText as FileTextIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import ActionSheet from "@/components/nurse/ActionSheet";

type PlanItem = { text: string; risk: "ok" | "warn"; note?: string };
const initialPlans = [
  {
    id: 1,
    patient: "张伟 · 床位 0312",
    title: "高血压术后护理方案",
    level: "高优先级",
    items: [
      { text: "每4小时测量血压", risk: "ok", note: "符合 JNC 8 临床规范" },
      { text: "低盐饮食宣教", risk: "ok" },
      { text: "服药提醒(降压药×2)", risk: "warn", note: "建议补充服药时间间隔" },
    ] as PlanItem[],
  },
];

const alerts = [
  { id: 1, bed: "0312", name: "张伟", desc: "血压异常飙升 · 178/108 mmHg", level: "危急" as const, doctor: "王主任", phone: "13800138001" },
];

// priority 越小越紧急
const todos = [
  { level: "urgent" as const, priority: 1, title: "服药逾期提醒", desc: "床位 0215 · 王强 · 逾期 35 分钟", detail: "王强(床位 0215)的降压药打卡已逾期 35 分钟,请联系患者或床旁确认。", quickAction: "去提醒" },
  { level: "normal" as const, priority: 2, title: "健康宣教推送", desc: "心内科患者 · 12 人", detail: "向心内科 12 位患者批量推送《高血压日常管理》。", quickAction: "去推送" },
].sort((a, b) => a.priority - b.priority);

const NurseHome = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState(initialPlans);
  const [generating, setGenerating] = useState(false);

  // sheet states
  const [alertSheet, setAlertSheet] = useState<typeof alerts[0] | null>(null);
  const [todoSheet, setTodoSheet] = useState<typeof todos[0] | null>(null);
  const [todoListSheet, setTodoListSheet] = useState(false);
  const [notifySheet, setNotifySheet] = useState(false);
  const [statSheet, setStatSheet] = useState<{ label: string; value: string } | null>(null);
  const [planAction, setPlanAction] = useState<{ plan: typeof initialPlans[0]; type: "approve" | "reject" } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleAIGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const next = {
        id: Date.now(),
        patient: "陈敏 · 床位 0617",
        title: "AI 推荐 · 心律失常观察护理",
        level: "高优先级",
        items: [
          { text: "持续心电监护", risk: "ok" as const, note: "符合临床规范" },
          { text: "每2小时记录心率", risk: "warn" as const, note: "建议增加血氧记录" },
          { text: "情绪安抚", risk: "ok" as const },
          { text: "急救药物床旁备用", risk: "ok" as const },
        ] as PlanItem[],
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
    setConfirmClear(false);
    toast({ title: "已清空全部方案", description: "您可重新让 AI 生成" });
  };

  const dispatchAlert = (a: typeof alerts[0]) => {
    toast({ title: "已下发处置流程", description: `${a.name}(床 ${a.bed})已通知值班医生` });
    setAlertSheet(null);
  };

  const handlePlanAction = () => {
    if (!planAction) return;
    setPlans((p) => p.filter((x) => x.id !== planAction.plan.id));
    toast({
      title: planAction.type === "approve" ? "已通过审核" : "已驳回方案",
      description: `${planAction.plan.title}`,
    });
    setPlanAction(null);
  };

  return (
    <div className="space-y-3 p-3">
      {/* 紧急预警 - 危急强化 */}
      <Card className="animate-critical-pulse overflow-hidden border-2 border-destructive/60 bg-destructive/5">
        <div className="flex items-center justify-between border-b border-destructive/30 bg-destructive/15 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-semibold text-destructive">紧急预警 · 患者求助</span>
          </div>
          <Badge variant="destructive" className="h-5 animate-pulse">{alerts.length} 危急</Badge>
        </div>
        <div className="divide-y divide-destructive/15">
          {alerts.map((a) => {
            // 颜色分级:危急=红, 高危=橙, 预警=黄
            const tone =
              a.level === "危急"
                ? { bar: "bg-destructive", badge: "bg-destructive text-destructive-foreground", text: "text-destructive" }
                : { bar: "bg-warning", badge: "bg-warning text-warning-foreground", text: "text-warning" };
            return (
              <div key={a.id} className="p-3">
                <div className="flex items-start gap-2">
                  <span className={`mt-1 h-10 w-1 shrink-0 rounded-full ${tone.bar}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">床位 {a.bed} · {a.name}</p>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${tone.badge}`}>{a.level}</span>
                    </div>
                    <p className={`mt-0.5 text-xs font-medium ${tone.text}`}>{a.desc}</p>
                  </div>
                </div>
                {/* 处置按钮主导,医生/患者后置缩小 */}
                <div className="mt-2.5 flex items-center gap-2">
                  <Button
                    size="sm"
                    className={`h-9 flex-1 text-sm font-semibold ${a.level === "危急" ? "bg-destructive hover:bg-destructive/90" : "bg-gradient-nurse"}`}
                    onClick={() => setAlertSheet(a)}
                  >
                    <CheckCircle2 className="mr-1 h-4 w-4" />立即处置
                  </Button>
                  <button
                    onClick={() => navigate(`/nurse/chat/doctor/${a.id}`)}
                    className="flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted"
                    aria-label="联系医生"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/nurse/chat/patient/${a.id}`)}
                    className="flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground hover:bg-muted"
                    aria-label="联系患者"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 今日核心数据 - 一行式卡片 */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">今日核心数据</span>
          <span className="text-[10px] text-muted-foreground">↗ 较昨日</span>
        </div>
        <div className="grid grid-cols-4 divide-x">
          <button onClick={() => navigate("/nurse/tasks")} className="flex flex-col items-center py-2.5 hover:bg-muted/40">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span className="mt-1 text-base font-bold text-primary">42</span>
            <span className="text-[10px] text-muted-foreground">院内</span>
          </button>
          <button onClick={() => setStatSheet({ label: "院外随访", value: "86" })} className="flex flex-col items-center py-2.5 hover:bg-muted/40">
            <Activity className="h-3.5 w-3.5 text-accent" />
            <span className="mt-1 text-base font-bold text-accent">86</span>
            <span className="text-[10px] text-muted-foreground">院外</span>
          </button>
          <button onClick={() => setStatSheet({ label: "任务完成", value: "28/35" })} className="flex flex-col items-center py-2.5 hover:bg-muted/40">
            <ListChecks className="h-3.5 w-3.5 text-success" />
            <span className="mt-1 text-base font-bold text-success">80%</span>
            <span className="text-[10px] text-muted-foreground">完成率</span>
          </button>
          <button onClick={() => setNotifySheet(true)} className="flex flex-col items-center py-2.5 hover:bg-muted/40">
            <Bell className="h-3.5 w-3.5 text-destructive" />
            <span className="mt-1 text-base font-bold text-destructive">6</span>
            <span className="text-[10px] text-muted-foreground">预警</span>
          </button>
        </div>
      </Card>


      {/* 待处理 - 聚合按优先级排序 */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">待处理</h3>
            <Badge variant="secondary" className="h-5">{todos.length}</Badge>
            <Badge variant="destructive" className="h-5 text-[10px]">高 {todos.filter((t) => t.level === "urgent").length}</Badge>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setTodoListSheet(true)}>
            全部 <ChevronRight className="ml-0.5 h-3 w-3" />
          </Button>
        </div>
        <div className="divide-y">
          {todos.map((t, i) => (
            <div key={i} className="flex items-center gap-2.5 px-4 py-2.5">
              <div className={`h-9 w-1 shrink-0 rounded-full ${t.level === "urgent" ? "bg-destructive" : "bg-accent"}`} />
              <button onClick={() => setTodoSheet(t)} className="min-w-0 flex-1 text-left">
                <div className="flex items-center gap-1.5">
                  {t.level === "urgent" && (
                    <span className="rounded bg-destructive/15 px-1 py-0.5 text-[9px] font-bold text-destructive">高</span>
                  )}
                  <p className="truncate text-sm">{t.title}</p>
                </div>
                <p className="truncate text-[11px] text-muted-foreground">{t.desc}</p>
              </button>
              <Button
                size="sm"
                variant={t.level === "urgent" ? "default" : "outline"}
                className={`h-7 px-2 text-[11px] ${t.level === "urgent" ? "bg-destructive hover:bg-destructive/90" : ""}`}
                onClick={() => toast({ title: t.quickAction, description: t.title })}
              >
                {t.quickAction}
              </Button>
            </div>
          ))}
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
            <Button size="sm" variant="outline" onClick={() => setConfirmClear(true)} disabled={!plans.length} className="h-8 border-destructive/40 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive">
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
                    <li key={i} className="flex items-start gap-1.5 text-xs">
                      <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${it.risk === "warn" ? "bg-warning" : "bg-success"}`} />
                      <span className="flex-1 text-foreground/80">
                        {it.text}
                        {it.note && (
                          <span className={`ml-1 rounded px-1 py-0.5 text-[10px] ${it.risk === "warn" ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}`}>
                            {it.risk === "warn" ? "需关注" : "规范"}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 flex-1 text-xs" onClick={() => setPlanAction({ plan: p, type: "reject" })}>驳回</Button>
                  <Button size="sm" className="h-7 flex-1 bg-gradient-nurse text-xs" onClick={() => setPlanAction({ plan: p, type: "approve" })}>通过</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ========== Sheets ========== */}
      <ActionSheet
        open={!!alertSheet}
        onOpenChange={(v) => !v && setAlertSheet(null)}
        title="一键处置确认"
        description={alertSheet ? `${alertSheet.name} · 床位 ${alertSheet.bed}` : ""}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setAlertSheet(null)}>取消</Button>
            <Button className="bg-gradient-nurse" onClick={() => alertSheet && dispatchAlert(alertSheet)}>确认处置</Button>
          </div>
        }
      >
        {alertSheet && (
          <div className="space-y-3 py-2">
            <div className="rounded-lg bg-destructive/5 p-3 text-xs">
              <p className="font-medium text-destructive">{alertSheet.desc}</p>
              <p className="mt-1 text-muted-foreground">触发时间:刚刚 · 持续 2 分钟</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">处置流程</p>
              <ul className="space-y-1.5 text-xs">
                {["立即床旁查看", `通知值班医生 ${alertSheet.doctor}`, "记录生命体征", "执行医嘱并复测"].map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/15 text-[10px] text-accent">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">处置证明 <span className="text-destructive">*</span></p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Camera, label: "现场照片" },
                  { icon: Activity, label: "体征截图" },
                  { icon: Mic, label: "语音记录" },
                ].map((o) => (
                  <button
                    key={o.label}
                    onClick={() => toast({ title: `已添加${o.label}`, description: "已附加到处置记录" })}
                    className="flex flex-col items-center gap-1 rounded-lg border border-dashed border-accent/40 bg-accent/5 p-2.5 text-[11px] text-accent hover:bg-accent/10"
                  >
                    <o.icon className="h-4 w-4" />
                    {o.label}
                  </button>
                ))}
              </div>
              <div className="mt-2 rounded-lg border bg-muted/30 p-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5"><FileTextIcon className="h-3 w-3 text-success" />医嘱执行单 #20241108-031</span>
                  <span className="text-success">已关联</span>
                </div>
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">处置结果</p>
              <div className="grid grid-cols-3 gap-1.5">
                {["已处理", "已上报", "持续观察"].map((r, i) => (
                  <label key={r} className="flex items-center justify-center gap-1 rounded-lg border p-2 text-[11px] hover:border-accent">
                    <input type="radio" name="result" defaultChecked={i === 0} className="h-3 w-3 accent-accent" />
                    {r}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">备注</p>
              <Textarea placeholder="可补充处置说明..." className="min-h-[60px] text-xs" />
            </div>
          </div>
        )}
      </ActionSheet>

      <ActionSheet
        open={!!todoSheet}
        onOpenChange={(v) => !v && setTodoSheet(null)}
        title={todoSheet?.title || ""}
        description={todoSheet?.desc}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setTodoSheet(null)}>稍后处理</Button>
            <Button
              className="bg-gradient-nurse"
              onClick={() => { toast({ title: "已标记完成", description: todoSheet?.title }); setTodoSheet(null); }}
            >
              <CheckCircle2 className="mr-1 h-4 w-4" />标记完成
            </Button>
          </div>
        }
      >
        {todoSheet && (
          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-lg bg-muted/40 p-3 leading-relaxed">{todoSheet.detail}</div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>优先级</span>
              <Badge variant={todoSheet.level === "urgent" ? "destructive" : "secondary"} className="h-5 text-[10px]">
                {todoSheet.level === "urgent" ? "高优先级" : "常规"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>截止时间</span>
              <span className="font-medium text-foreground">今日 18:00</span>
            </div>
          </div>
        )}
      </ActionSheet>

      <ActionSheet
        open={todoListSheet}
        onOpenChange={setTodoListSheet}
        title="今日全部待办"
        description={`共 ${todos.length} 项任务`}
      >
        <div className="divide-y">
          {todos.map((t, i) => (
            <button
              key={i}
              onClick={() => { setTodoListSheet(false); setTimeout(() => setTodoSheet(t), 200); }}
              className="flex w-full items-center gap-3 py-3 text-left"
            >
              <div className={`h-8 w-1 shrink-0 rounded-full ${t.level === "urgent" ? "bg-destructive" : "bg-accent"}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{t.title}</p>
                <p className="truncate text-[11px] text-muted-foreground">{t.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </ActionSheet>

      <ActionSheet
        open={!!statSheet}
        onOpenChange={(v) => !v && setStatSheet(null)}
        title={statSheet?.label || ""}
        description="详细数据概览"
      >
        {statSheet && (
          <div className="space-y-3 py-2">
            <div className="rounded-lg bg-gradient-to-br from-accent/10 to-primary/10 p-4 text-center">
              <p className="text-3xl font-bold">{statSheet.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{statSheet.label}</p>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: "今日新增", value: "+8" },
                { label: "本周累计", value: "156" },
                { label: "环比上周", value: "+12%" },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="font-semibold">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </ActionSheet>

      <ActionSheet
        open={notifySheet}
        onOpenChange={setNotifySheet}
        title="通知中心"
        description="今日 6 条预警 · 3 条未读"
        footer={
          <Button variant="outline" className="w-full" onClick={() => { toast({ title: "已全部标记为已读" }); setNotifySheet(false); }}>
            全部标记为已读
          </Button>
        }
      >
        <div className="divide-y">
          {[
            { title: "血压异常预警", desc: "床 0312 · 张伟 · 178/108 mmHg", time: "刚刚", unread: true },
            { title: "服药打卡逾期", desc: "床 0215 · 王强", time: "10 分钟前", unread: true },
            { title: "出院手续提醒", desc: "床 0408 · 王芳 14:00", time: "30 分钟前", unread: true },
            { title: "宣教任务推送成功", desc: "心内科 · 28 人已接收", time: "1 小时前", unread: false },
            { title: "夜班交接提醒", desc: "18:00 与张护士交接", time: "2 小时前", unread: false },
          ].map((n, i) => (
            <div key={i} className="flex items-start gap-3 py-3">
              <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-destructive" : "bg-muted"}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{n.title}</p>
                <p className="truncate text-[11px] text-muted-foreground">{n.desc}</p>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
            </div>
          ))}
        </div>
      </ActionSheet>

      <ActionSheet
        open={!!planAction}
        onOpenChange={(v) => !v && setPlanAction(null)}
        title={planAction?.type === "approve" ? "通过审核" : "驳回方案"}
        description={planAction?.plan.title}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setPlanAction(null)}>取消</Button>
            <Button
              className={planAction?.type === "approve" ? "bg-gradient-nurse" : ""}
              variant={planAction?.type === "approve" ? "default" : "destructive"}
              onClick={handlePlanAction}
            >
              确认{planAction?.type === "approve" ? "通过" : "驳回"}
            </Button>
          </div>
        }
      >
        {planAction && (
          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-lg bg-muted/40 p-3">
              <p className="text-muted-foreground">{planAction.plan.patient}</p>
              <ul className="mt-2 space-y-1">
                {planAction.plan.items.map((it, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className={`h-1 w-1 shrink-0 rounded-full ${it.risk === "warn" ? "bg-warning" : "bg-accent"}`} />{it.text}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1.5 font-medium text-muted-foreground">{planAction.type === "approve" ? "审核备注(可选)" : "驳回原因"}</p>
              <Textarea placeholder={planAction.type === "approve" ? "可补充审核意见..." : "请说明驳回原因..."} className="min-h-[60px] text-xs" />
            </div>
          </div>
        )}
      </ActionSheet>

      <ActionSheet
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="确认清空全部方案?"
        description="此操作不可撤销,将移除所有待审核方案"
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setConfirmClear(false)}>取消</Button>
            <Button variant="destructive" onClick={handleClearAll}>
              <Trash2 className="mr-1 h-4 w-4" />确认清空
            </Button>
          </div>
        }
      >
        <div className="flex items-center gap-3 rounded-lg bg-destructive/5 p-3 text-xs">
          <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
          <span>当前共 <b>{plans.length}</b> 项待审核方案将被清空,清空后可重新由 AI 生成。</span>
        </div>
      </ActionSheet>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, sub, color, bg, onClick }: any) => (
  <button onClick={onClick} className="text-left">
    <Card className="p-3 transition-colors hover:bg-muted/30">
      <div className="flex items-center justify-between">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <span className="text-[10px] text-muted-foreground">{sub}</span>
      </div>
      <p className="mt-2 text-xl font-semibold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </Card>
  </button>
);

export default NurseHome;
