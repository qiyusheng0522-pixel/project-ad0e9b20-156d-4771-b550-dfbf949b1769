import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search, Filter, ChevronRight, Phone, MessageSquare, AlertTriangle,
  FileText, Pill, Activity, ClipboardList, Save, Sparkles, CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import ActionSheet from "@/components/nurse/ActionSheet";

type Stage = "待入院" | "院中" | "待出院" | "历史";
type Patient = {
  id: number;
  name: string;
  bed: string;
  age: number;
  gender: "男" | "女";
  diagnosis: string;
  condition: string; // 病症
  stage: Stage;
  allergy: string;
  doctor: string;
  abnormal: boolean;
  metric: { label: string; value: string; unit: string };
  hba1c: string;
  meds: { name: string; dose: string }[];
};

const allPatients: Patient[] = [
  { id: 1, name: "张伟", bed: "0312", age: 58, gender: "男", diagnosis: "2 型糖尿病 · 酮症倾向", condition: "糖尿病", stage: "院中", allergy: "青霉素", doctor: "王主任", abnormal: true,
    metric: { label: "随机血糖", value: "16.8", unit: "mmol/L" }, hba1c: "9.2%",
    meds: [{ name: "门冬胰岛素", dose: "8U 三餐前皮下" }, { name: "二甲双胍", dose: "0.5g 每日 3 次" }] },
  { id: 2, name: "李娜", bed: "0508", age: 45, gender: "女", diagnosis: "2 型糖尿病 · 周围神经病变", condition: "糖尿病", stage: "院中", allergy: "无", doctor: "李医生", abnormal: true,
    metric: { label: "空腹血糖", value: "9.6", unit: "mmol/L" }, hba1c: "8.4%",
    meds: [{ name: "甘精胰岛素", dose: "16U 睡前" }, { name: "甲钴胺", dose: "0.5mg 每日 3 次" }] },
  { id: 3, name: "王强", bed: "0215", age: 42, gender: "男", diagnosis: "Graves 病 · 甲状腺功能亢进", condition: "甲亢", stage: "院中", allergy: "无", doctor: "王主任", abnormal: true,
    metric: { label: "心率", value: "128", unit: "bpm" }, hba1c: "—",
    meds: [{ name: "甲巯咪唑", dose: "10mg 每日 3 次" }, { name: "美托洛尔", dose: "25mg 每日 2 次" }] },
  { id: 4, name: "陈敏", bed: "0617", age: 51, gender: "女", diagnosis: "1 型糖尿病", condition: "糖尿病", stage: "待出院", allergy: "海鲜", doctor: "张医生", abnormal: false,
    metric: { label: "空腹血糖", value: "6.2", unit: "mmol/L" }, hba1c: "6.8%",
    meds: [{ name: "门冬胰岛素", dose: "6U 三餐前" }, { name: "地特胰岛素", dose: "12U 睡前" }] },
  { id: 5, name: "赵磊", bed: "—", age: 48, gender: "男", diagnosis: "桥本甲状腺炎 · 甲减", condition: "甲减", stage: "待入院", allergy: "无", doctor: "李医生", abnormal: false,
    metric: { label: "TSH", value: "5.8", unit: "mIU/L" }, hba1c: "—",
    meds: [{ name: "左甲状腺素钠", dose: "75μg 早餐前" }] },
  { id: 6, name: "周婷", bed: "0305", age: 39, gender: "女", diagnosis: "妊娠糖尿病", condition: "糖尿病", stage: "院中", allergy: "无", doctor: "张医生", abnormal: false,
    metric: { label: "餐后 2h", value: "8.4", unit: "mmol/L" }, hba1c: "6.2%",
    meds: [{ name: "门冬胰岛素", dose: "4U 三餐前" }] },
  { id: 7, name: "刘洋", bed: "—", age: 36, gender: "男", diagnosis: "库欣综合征 · 继发性高血压", condition: "库欣综合征", stage: "历史", allergy: "无", doctor: "王主任", abnormal: false,
    metric: { label: "血压", value: "138/86", unit: "mmHg" }, hba1c: "5.9%",
    meds: [{ name: "螺内酯", dose: "20mg 每日 2 次" }] },
];

const stageTabs: ("全部" | Stage)[] = ["全部", "待入院", "院中", "待出院", "历史"];

const NursePatients = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>(params.get("filter") || "全部");
  const [filterSheet, setFilterSheet] = useState(false);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [summaryDraft, setSummaryDraft] = useState("");
  const [savedSummary, setSavedSummary] = useState<Record<number, { date: string; text: string }>>({});

  const list = useMemo(
    () =>
      allPatients
        .filter((p) => {
          const ms = !search || p.name.includes(search) || p.bed.includes(search);
          const mf = filter === "全部" || p.status === filter;
          return ms && mf;
        })
        .sort((a, b) => Number(b.abnormal) - Number(a.abnormal)),
    [search, filter]
  );

  const openPatient = (p: Patient) => {
    setSelected(p);
    setSummaryDraft(savedSummary[p.id]?.text || "");
  };

  const aiFillSummary = () => {
    if (!selected) return;
    const tpl = selected.diagnosis.includes("糖尿病")
      ? `今日血糖监测 4 次,${selected.metric.label} ${selected.metric.value} ${selected.metric.unit};胰岛素按剂量执行,无低血糖反应;低糖饮食执行良好,睡眠正常。`
      : selected.diagnosis.includes("甲")
      ? `今日心率 ${selected.metric.value} ${selected.metric.unit},甲状腺相关症状有所缓解;按时服药,饮食低碘,情绪稳定。`
      : `今日各项护理操作按计划完成,患者一般情况尚可,无特殊不适主诉。`;
    setSummaryDraft(tpl);
  };

  const saveSummary = () => {
    if (!selected) return;
    setSavedSummary((s) => ({ ...s, [selected.id]: { date: "今日", text: summaryDraft } }));
    toast({ title: "今日小结已保存", description: `${selected.name} · 床 ${selected.bed}` });
  };

  return (
    <div className="space-y-3 p-4">
      {/* 顶部统计 */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "在管", value: allPatients.length, color: "text-primary", bg: "bg-primary/10" },
          { label: "异常", value: allPatients.filter((p) => p.abnormal).length, color: "text-destructive", bg: "bg-destructive/10" },
          { label: "待处理", value: allPatients.filter((p) => p.status === "待处理").length, color: "text-warning", bg: "bg-warning/10" },
        ].map((s) => (
          <Card key={s.label} className="p-3 text-center shadow-soft">
            <div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}>
              <Activity className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="mt-2 text-xl font-bold">{s.value}</p>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* 搜索 + 筛选 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索患者姓名/床位"
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

      {/* 患者列表 */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">患者列表</h3>
          <span className="text-xs text-muted-foreground">{list.length} 位</span>
        </div>
        <div className="divide-y">
          {list.length === 0 && <div className="px-4 py-10 text-center text-sm text-muted-foreground">无匹配患者</div>}
          {list.map((p) => (
            <button
              key={p.id}
              onClick={() => openPatient(p)}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${p.abnormal ? "bg-destructive/5 hover:bg-destructive/10" : "hover:bg-muted/40"}`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${p.abnormal ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary"}`}>
                {p.bed}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">{p.name}</span>
                  <span className="text-[10px] text-muted-foreground">{p.age}岁 · {p.gender}</span>
                  {p.abnormal && <Badge variant="destructive" className="h-4 px-1 text-[9px]">异常</Badge>}
                  {savedSummary[p.id] && <Badge variant="outline" className="h-4 border-success px-1 text-[9px] text-success">已小结</Badge>}
                </div>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{p.diagnosis}</p>
                <p className="mt-1 text-[11px]">
                  <span className="text-muted-foreground">{p.metric.label}:</span>
                  <span className={`ml-1 font-semibold ${p.abnormal ? "text-destructive" : "text-foreground"}`}>
                    {p.metric.value} {p.metric.unit}
                  </span>
                </p>
              </div>
              <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </Card>

      {/* 筛选 Sheet */}
      <ActionSheet
        open={filterSheet}
        onOpenChange={setFilterSheet}
        title="筛选患者"
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => { setFilter("全部"); setFilterSheet(false); }}>重置</Button>
            <Button className="bg-gradient-nurse" onClick={() => setFilterSheet(false)}>应用</Button>
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-2 py-2">
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
      </ActionSheet>

      {/* 患者详情 */}
      <ActionSheet
        open={!!selected}
        onOpenChange={(v) => !v && setSelected(null)}
        title={selected ? `${selected.name} · 床 ${selected.bed}` : ""}
        description={selected ? `${selected.age}岁 · ${selected.gender} · 主治 ${selected.doctor}` : ""}
        footer={
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => selected && navigate(`/nurse/chat/doctor/${selected.id}`)}>
              <Phone className="mr-1 h-3 w-3" />医生
            </Button>
            <Button variant="outline" size="sm" onClick={() => selected && navigate(`/nurse/chat/patient/${selected.id}`)}>
              <MessageSquare className="mr-1 h-3 w-3" />患者
            </Button>
            <Button size="sm" className="bg-gradient-nurse" onClick={saveSummary}>
              <Save className="mr-1 h-3 w-3" />保存小结
            </Button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-3 py-2">
            {/* 诊断 / 过敏 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-primary/5 p-2.5 text-xs">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                  <FileText className="h-3 w-3" />主要诊断
                </div>
                {selected.diagnosis}
              </div>
              <div className="rounded-lg bg-destructive/5 p-2.5 text-xs">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-destructive">
                  <AlertTriangle className="h-3 w-3" />过敏史
                </div>
                {selected.allergy}
              </div>
            </div>

            {/* 当前指标 */}
            <div className={`rounded-lg p-3 text-xs ${selected.abnormal ? "bg-destructive/5" : "bg-muted/40"}`}>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{selected.metric.label}</span>
                <span className={`text-base font-semibold ${selected.abnormal ? "text-destructive" : ""}`}>
                  {selected.metric.value} {selected.metric.unit}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>HbA1c {selected.hba1c}</span>
                <span>最近测量:5 分钟前</span>
              </div>
            </div>

            {/* 当前用药 */}
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">当前用药</p>
              <div className="space-y-1.5">
                {selected.meds.map((m) => (
                  <div key={m.name} className="flex items-center gap-2 rounded-lg border bg-card p-2 text-[11px]">
                    <Pill className="h-3.5 w-3.5 text-accent" />
                    <span className="flex-1 font-medium">{m.name}</span>
                    <span className="text-muted-foreground">{m.dose}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 今日小结 */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <ClipboardList className="h-3.5 w-3.5" />今日护理小结
                </div>
                <button onClick={aiFillSummary} className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent hover:bg-accent/20">
                  <Sparkles className="h-3 w-3" />AI 一键填写
                </button>
              </div>
              <Textarea
                value={summaryDraft}
                onChange={(e) => setSummaryDraft(e.target.value)}
                placeholder="记录今日护理观察、操作执行情况、患者反应、下一步重点..."
                className="min-h-[90px] text-xs"
              />
              {savedSummary[selected.id] && (
                <p className="mt-1 flex items-center gap-1 text-[10px] text-success">
                  <CheckCircle2 className="h-3 w-3" />{savedSummary[selected.id].date}已保存,可继续编辑
                </p>
              )}
            </div>
          </div>
        )}
      </ActionSheet>
    </div>
  );
};

export default NursePatients;
