import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Filter, AlertCircle, CheckCircle2, Activity, Bell, ChevronRight,
  Phone, MessageSquare, Eye, X, User, Camera, Mic, FileText, Pill, AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import ActionSheet from "@/components/nurse/ActionSheet";

const allPatients = [
  { id: 1, name: "张伟", bed: "0312", status: "异常", task: "血压监测", abnormal: true, value: "178/108", metric: "mmHg", age: 58, doctor: "王主任" },
  { id: 2, name: "李娜", bed: "0508", status: "正常", task: "血糖记录", abnormal: false, value: "6.2", metric: "mmol/L", age: 45, doctor: "李医生" },
  { id: 3, name: "王强", bed: "0215", status: "异常", task: "心率监测", abnormal: true, value: "118", metric: "bpm", age: 62, doctor: "王主任" },
  { id: 4, name: "陈敏", bed: "0617", status: "正常", task: "服药打卡", abnormal: false, value: "已完成", metric: "", age: 51, doctor: "张医生" },
  { id: 5, name: "赵磊", bed: "0419", status: "待处理", task: "护理记录", abnormal: false, value: "待补充", metric: "", age: 48, doctor: "李医生" },
];

const filterTabs = ["全部", "异常", "正常", "待处理"];

const NurseTasks = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("全部");
  const [filterSheet, setFilterSheet] = useState(false);
  const [patientSheet, setPatientSheet] = useState<typeof allPatients[0] | null>(null);
  const [actionSheet, setActionSheet] = useState<string | null>(null);
  const [batchSheet, setBatchSheet] = useState<"remind" | "complete" | null>(null);

  const patients = allPatients
    .filter((p) => {
      const matchSearch = !search || p.name.includes(search) || p.bed.includes(search);
      const matchFilter = filter === "全部" || p.status === filter;
      return matchSearch && matchFilter;
    })
    // 异常患者置顶
    .sort((a, b) => Number(b.abnormal) - Number(a.abnormal));

  const toggle = (id: number) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const confirmBatch = () => {
    toast({
      title: batchSheet === "remind" ? "批量提醒已发送" : "批量完成成功",
      description: `已对 ${selected.length} 位患者执行操作`,
    });
    setSelected([]);
    setBatchSheet(null);
  };

  const handleAbnormalAction = (label: string) => {
    toast({ title: `${label}已执行`, description: "操作已记录到护理日志" });
    setActionSheet(null);
  };

  return (
    <div className="space-y-4 p-4">
      {/* 实时监测看板 */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">实时监测看板</h3>
          </div>
          <Badge variant="destructive" className="h-5 animate-pulse">2 异常</Badge>
        </div>
        <div className="grid grid-cols-3 divide-x">
          <div className="p-3 text-center">
            <p className="text-xs text-muted-foreground">在线监测</p>
            <p className="mt-1 text-xl font-semibold text-primary">42</p>
          </div>
          <div className="p-3 text-center">
            <p className="text-xs text-muted-foreground">异常高亮</p>
            <p className="mt-1 text-xl font-semibold text-destructive">2</p>
          </div>
          <div className="p-3 text-center">
            <p className="text-xs text-muted-foreground">消息推送</p>
            <p className="mt-1 text-xl font-semibold text-accent">15</p>
          </div>
        </div>
      </Card>

      {/* 异常处理快捷区 */}
      <Card className="overflow-hidden border-warning/30 bg-warning/5">
        <div className="flex items-center justify-between border-b border-warning/20 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            <span className="text-sm font-semibold">异常处置</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1 p-2">
          {[
            { label: "联系医生", icon: Phone },
            { label: "联系患者", icon: MessageSquare },
            { label: "查看现场", icon: Eye },
            { label: "无需处理", icon: CheckCircle2 },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => setActionSheet(a.label)}
              className="flex flex-col items-center gap-1 rounded-lg p-2 text-xs transition-colors hover:bg-warning/10"
            >
              <a.icon className="h-4 w-4 text-warning" />
              <span>{a.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* 搜索 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索患者/床位"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-8 text-sm"
          />
        </div>
        <Button
          variant={filter !== "全部" ? "default" : "outline"}
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => setFilterSheet(true)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* 批量操作栏 */}
      {selected.length > 0 && (
        <div className="sticky top-2 z-10 flex items-center justify-between rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 shadow-soft">
          <span className="text-sm font-medium">已选 {selected.length} 项</span>
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setBatchSheet("remind")}>
              <Bell className="mr-1 h-3 w-3" />提醒
            </Button>
            <Button size="sm" className="h-7 bg-gradient-nurse text-xs" onClick={() => setBatchSheet("complete")}>
              <CheckCircle2 className="mr-1 h-3 w-3" />完成
            </Button>
          </div>
        </div>
      )}

      {/* 患者任务列表 */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">患者任务监控</h3>
          <span className="text-xs text-muted-foreground">{patients.length} 位</span>
        </div>
        <div className="divide-y">
          {patients.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">无匹配患者</div>
          )}
          {patients.map((p) => (
            <div
              key={p.id}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${selected.includes(p.id) ? "bg-accent/5" : "hover:bg-muted/50"}`}
            >
              <input
                type="checkbox"
                checked={selected.includes(p.id)}
                onChange={() => toggle(p.id)}
                className="h-4 w-4 shrink-0 accent-accent"
              />
              <button onClick={() => setPatientSheet(p)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold">{p.bed}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{p.name}</span>
                    {p.abnormal && <Badge variant="destructive" className="h-4 px-1 text-[9px]">异常</Badge>}
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">{p.task} · {p.value}{p.metric && ` ${p.metric}`}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* 一键提醒 */}
      <Button
        className="w-full bg-gradient-nurse"
        size="lg"
        onClick={() => toast({ title: "一键提醒已发送", description: "已通知所有未完成患者" })}
      >
        <Bell className="mr-2 h-4 w-4" />一键提醒所有未完成患者
      </Button>

      {/* ========== Sheets ========== */}
      <ActionSheet
        open={filterSheet}
        onOpenChange={setFilterSheet}
        title="筛选条件"
        description="按状态筛选患者任务"
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => { setFilter("全部"); setFilterSheet(false); }}>重置</Button>
            <Button className="bg-gradient-nurse" onClick={() => setFilterSheet(false)}>应用</Button>
          </div>
        }
      >
        <div className="space-y-3 py-2">
          <p className="text-xs font-medium text-muted-foreground">任务状态</p>
          <div className="grid grid-cols-2 gap-2">
            {filterTabs.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`rounded-lg border p-3 text-sm transition-colors ${
                  filter === t ? "border-accent bg-accent/10 font-medium text-accent" : "border-border hover:bg-muted/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </ActionSheet>

      <ActionSheet
        open={!!actionSheet}
        onOpenChange={(v) => !v && setActionSheet(null)}
        title={actionSheet || ""}
        description="选择需要执行操作的患者"
        footer={
          <Button className="w-full bg-gradient-nurse" onClick={() => actionSheet && handleAbnormalAction(actionSheet)}>
            确认执行
          </Button>
        }
      >
        <div className="space-y-3 py-2">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">异常患者</p>
            <div className="space-y-2">
              {allPatients.filter((p) => p.abnormal).map((p) => (
                <label key={p.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-accent" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.name} · 床 {p.bed}</p>
                    <p className="text-[11px] text-muted-foreground">{p.task} · {p.value} {p.metric}</p>
                  </div>
                  <Badge variant="destructive" className="h-5 text-[10px]">异常</Badge>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">处置证明</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Camera, label: "拍照" },
                { icon: Activity, label: "体征" },
                { icon: Mic, label: "录音" },
              ].map((o) => (
                <button
                  key={o.label}
                  onClick={() => toast({ title: `已添加${o.label}` })}
                  className="flex flex-col items-center gap-1 rounded-lg border border-dashed border-accent/40 bg-accent/5 p-2.5 text-[11px] text-accent hover:bg-accent/10"
                >
                  <o.icon className="h-4 w-4" />
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <Textarea placeholder="处置说明(可选)" className="min-h-[50px] text-xs" />
        </div>
      </ActionSheet>

      <ActionSheet
        open={!!patientSheet}
        onOpenChange={(v) => !v && setPatientSheet(null)}
        title={patientSheet ? `${patientSheet.name} · 床位 ${patientSheet.bed}` : ""}
        description={patientSheet ? `${patientSheet.age} 岁 · 主治 ${patientSheet.doctor}` : ""}
        footer={
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => patientSheet && navigate(`/nurse/chat/doctor/${patientSheet.id}`)}
            >
              <Phone className="mr-1 h-3 w-3" />医生
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => patientSheet && navigate(`/nurse/chat/patient/${patientSheet.id}`)}
            >
              <MessageSquare className="mr-1 h-3 w-3" />患者
            </Button>
            <Button size="sm" className="bg-gradient-nurse" onClick={() => { toast({ title: "已标记完成" }); setPatientSheet(null); }}>
              <CheckCircle2 className="mr-1 h-3 w-3" />完成
            </Button>
          </div>
        }
      >
        {patientSheet && (
          <div className="space-y-3 py-2">
            {/* 基本信息 */}
            <div className="grid grid-cols-3 gap-2 rounded-lg border bg-muted/20 p-2.5 text-[11px]">
              <div>
                <p className="text-muted-foreground">入院日期</p>
                <p className="mt-0.5 font-medium">11-05</p>
              </div>
              <div>
                <p className="text-muted-foreground">住院天数</p>
                <p className="mt-0.5 font-medium">5 天</p>
              </div>
              <div>
                <p className="text-muted-foreground">护理等级</p>
                <p className="mt-0.5 font-medium text-warning">二级</p>
              </div>
            </div>

            {/* 诊断 / 过敏 */}
            <div className="space-y-2">
              <div className="rounded-lg bg-primary/5 p-2.5 text-xs">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                  <FileText className="h-3 w-3" />主要诊断
                </div>
                {patientSheet.abnormal ? "高血压 III 级 · 冠心病" : "2 型糖尿病"}
              </div>
              <div className="rounded-lg bg-destructive/5 p-2.5 text-xs">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-destructive">
                  <AlertTriangle className="h-3 w-3" />过敏史
                </div>
                青霉素 · 头孢类
              </div>
            </div>

            {/* 当前指标 */}
            <div className={`rounded-lg p-3 text-xs ${patientSheet.abnormal ? "bg-destructive/5" : "bg-muted/40"}`}>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{patientSheet.task}</span>
                <span className={`text-base font-semibold ${patientSheet.abnormal ? "text-destructive" : ""}`}>
                  {patientSheet.value} {patientSheet.metric}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">最近测量:5 分钟前</p>
            </div>

            {/* 用药 */}
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">当前用药</p>
              <div className="space-y-1.5">
                {[
                  { name: "硝苯地平缓释片", dose: "30mg · 每日 1 次" },
                  { name: "美托洛尔", dose: "25mg · 每日 2 次" },
                ].map((m) => (
                  <div key={m.name} className="flex items-center gap-2 rounded-lg border bg-card p-2 text-[11px]">
                    <Pill className="h-3.5 w-3.5 text-accent" />
                    <span className="flex-1 font-medium">{m.name}</span>
                    <span className="text-muted-foreground">{m.dose}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 任务进展 */}
            <div className="space-y-2 text-xs">
              <p className="font-medium text-muted-foreground">今日任务进展</p>
              {[
                { label: "晨间体征监测", done: true },
                { label: "服药打卡 · 上午", done: true },
                { label: "护理记录填写", done: false },
                { label: "宣教内容学习", done: false },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2">
                  <CheckCircle2 className={`h-3.5 w-3.5 ${t.done ? "text-success" : "text-muted-foreground/40"}`} />
                  <span className={t.done ? "" : "text-muted-foreground"}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </ActionSheet>

      <ActionSheet
        open={!!batchSheet}
        onOpenChange={(v) => !v && setBatchSheet(null)}
        title={batchSheet === "remind" ? "批量提醒" : "批量完成"}
        description={`将对已选 ${selected.length} 位患者执行操作`}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setBatchSheet(null)}>取消</Button>
            <Button className="bg-gradient-nurse" onClick={confirmBatch}>确认</Button>
          </div>
        }
      >
        <div className="space-y-3 py-2">
          {batchSheet === "remind" ? (
            <>
              <p className="text-xs font-medium text-muted-foreground">提醒方式</p>
              <div className="grid grid-cols-2 gap-2">
                {["短信通知", "App 推送", "电话提醒", "床旁广播"].map((m) => (
                  <label key={m} className="flex items-center gap-2 rounded-lg border p-2.5 text-xs">
                    <input type="checkbox" defaultChecked={m === "App 推送"} className="h-3.5 w-3.5 accent-accent" />
                    {m}
                  </label>
                ))}
              </div>
              <Textarea placeholder="提醒内容(可选)" className="min-h-[60px] text-xs" />
            </>
          ) : (
            <>
              <div className="rounded-lg bg-success/10 p-3 text-xs">
                <CheckCircle2 className="mb-1 h-4 w-4 text-success" />
                确认将 {selected.length} 项任务标记为完成,系统将自动归档护理记录。
              </div>
              <Textarea placeholder="备注(可选)" className="min-h-[60px] text-xs" />
            </>
          )}
        </div>
      </ActionSheet>
    </div>
  );
};

export default NurseTasks;
