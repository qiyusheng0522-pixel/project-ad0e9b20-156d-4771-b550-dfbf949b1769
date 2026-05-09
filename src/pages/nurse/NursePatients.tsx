import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search, ChevronRight, Phone, MessageSquare, AlertTriangle,
  FileText, Pill, Users as UsersIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  const [conditionFilter, setConditionFilter] = useState<string>("全部疾病");
  const [selected, setSelected] = useState<Patient | null>(null);

  const conditions = useMemo(() => {
    const set = new Set<string>(["全部疾病"]);
    allPatients.forEach((p) => set.add(p.condition));
    return Array.from(set);
  }, []);

  const list = useMemo(
    () =>
      allPatients
        .filter((p) => {
          const ms = !search || p.name.includes(search) || p.bed.includes(search);
          const mf = filter === "全部" || p.stage === filter;
          const mc = conditionFilter === "全部疾病" || p.condition === conditionFilter;
          return ms && mf && mc;
        })
        .sort((a, b) => Number(b.abnormal) - Number(a.abnormal)),
    [search, filter, conditionFilter]
  );

  const stageCount = (s: Stage) => allPatients.filter((p) => p.stage === s).length;

  const openPatient = (p: Patient) => setSelected(p);

  return (
    <div className="space-y-3 p-4">
      {/* 搜索 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索患者姓名/床位"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 pl-8 text-sm"
        />
      </div>

      {/* 病症筛选 */}
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1">
        {conditions.map((c) => {
          const active = conditionFilter === c;
          return (
            <button
              key={c}
              onClick={() => setConditionFilter(c)}
              className={`shrink-0 rounded-full border px-3 py-1 text-[11px] transition-colors ${
                active ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"
              }`}
            >
              {c}
            </button>
          );
        })}
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
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
            >
              {/* 头像 */}
              <div className="relative shrink-0">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold ${p.abnormal ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary"}`}>
                  {p.name[0]}
                </div>
                <div className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-warning text-[8px] text-white">
                  <UsersIcon className="h-2.5 w-2.5" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">{p.name}</span>
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">我负责</span>
                  {p.abnormal && <Badge variant="destructive" className="h-4 px-1 text-[9px]">异常</Badge>}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                  <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] text-destructive">{p.condition}</span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{p.stage}</span>
                  {p.bed !== "—" && <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">床 {p.bed}</span>}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span
                    onClick={(e) => { e.stopPropagation(); navigate(`/nurse/chat/patient/${p.id}`); }}
                    className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] text-primary"
                  >
                    <MessageSquare className="h-3 w-3" />沟通
                  </span>
                  <span className="flex items-center gap-1 rounded-full border border-warning/30 bg-warning/5 px-2 py-0.5 text-[10px] text-warning">
                    <UsersIcon className="h-3 w-3" />会诊
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </Card>

      {/* 患者详情 */}
      <ActionSheet
        open={!!selected}
        onOpenChange={(v) => !v && setSelected(null)}
        title={selected ? `${selected.name}` : ""}
        description={selected ? `${selected.age}岁 · ${selected.gender} · 床 ${selected.bed} · 主治 ${selected.doctor}` : ""}
        footer={
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => selected && navigate(`/nurse/chat/patient/${selected.id}`)}>
              <MessageSquare className="mr-1 h-3 w-3" />沟通
            </Button>
            <Button variant="outline" size="sm" onClick={() => selected && toast({ title: "正在呼叫", description: selected.name })}>
              <Phone className="mr-1 h-3 w-3" />电话
            </Button>
            <Button size="sm" className="bg-gradient-nurse" onClick={() => navigate("/nurse/plans")}>
              <FileText className="mr-1 h-3 w-3" />护理方案
            </Button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-3 py-2">
            {/* 头部头像 */}
            <div className="flex flex-col items-center pb-1">
              <div className={`flex h-20 w-20 items-center justify-center rounded-full text-2xl font-semibold ${selected.abnormal ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary"}`}>
                {selected.name[0]}
              </div>
              <p className="mt-2 text-base font-semibold">{selected.name}</p>
              <p className="text-[11px] text-muted-foreground">更新于 2026-04-16 15:24</p>
            </div>

            {/* 患者档案 */}
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
                <FileText className="h-3.5 w-3.5" />患者档案
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { k: "姓名", v: selected.name },
                  { k: "性别", v: selected.gender },
                  { k: "年龄", v: `${selected.age}岁` },
                  { k: "床位", v: selected.bed },
                  { k: "主治医师", v: selected.doctor },
                  { k: "在院阶段", v: selected.stage },
                ].map((f) => (
                  <div key={f.k} className="rounded-lg bg-muted/50 p-2.5">
                    <p className="text-[10px] text-muted-foreground">{f.k}</p>
                    <p className="mt-0.5 font-medium">{f.v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 诊断 / 过敏 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-primary/5 p-2.5 text-xs">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium text-primary">
                  <FileText className="h-3 w-3" />主要诊断
                </div>
                {selected.diagnosis}
              </div>
              <div className="rounded-lg bg-destructive/5 p-2.5 text-xs">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium text-destructive">
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
          </div>
        )}
      </ActionSheet>
    </div>
  );
};

export default NursePatients;
