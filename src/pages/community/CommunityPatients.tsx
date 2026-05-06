import { useState } from "react";
import { Search, Sparkles, FileText, Phone, Activity, ChevronRight, ArrowUpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import ActionSheet from "@/components/nurse/ActionSheet";

type Patient = {
  id: number;
  name: string;
  age: number;
  gender: "男" | "女";
  tags: string[];
  source: "医院下转" | "社区建档";
  isNew?: boolean;
  abnormal?: boolean;
  lastVisit: string;
};

const patients: Patient[] = [
  { id: 1, name: "张伟", age: 58, gender: "男", tags: ["高血压III级", "术后"], source: "医院下转", isNew: true, lastVisit: "今日下转" },
  { id: 2, name: "李建国", age: 62, gender: "男", tags: ["糖尿病", "异常↑"], source: "社区建档", abnormal: true, lastVisit: "1 小时前" },
  { id: 3, name: "刘秀英", age: 67, gender: "女", tags: ["高血压"], source: "社区建档", lastVisit: "3 天前" },
  { id: 4, name: "陈敏", age: 55, gender: "女", tags: ["心律失常"], source: "医院下转", isNew: true, lastVisit: "今日下转" },
];

const tabs = [
  { key: "all", label: "全部" },
  { key: "new", label: "新接收" },
  { key: "abnormal", label: "异常" },
];

const CommunityPatients = () => {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<Patient | null>(null);

  const filtered = patients.filter((p) => {
    if (tab === "new" && !p.isNew) return false;
    if (tab === "abnormal" && !p.abnormal) return false;
    if (q && !p.name.includes(q)) return false;
    return true;
  });

  return (
    <div className="space-y-3 p-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索患者姓名" className="h-9 pl-8 text-sm" />
      </div>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
              tab === t.key ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground"
            }`}
          >
            {t.label}
            {t.key === "new" && <span className="ml-1 rounded bg-accent/20 px-1 text-[10px]">2</span>}
            {t.key === "abnormal" && <span className="ml-1 rounded bg-destructive/20 px-1 text-[10px] text-destructive">1</span>}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((p) => (
          <Card key={p.id} className={`overflow-hidden ${p.abnormal ? "border-destructive/40 bg-destructive/5" : ""}`}>
            <button onClick={() => setDetail(p)} className="w-full p-3 text-left">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-community text-sm font-semibold text-primary-foreground">
                  {p.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold">{p.name}</p>
                    <span className="text-[11px] text-muted-foreground">{p.gender} · {p.age}岁</span>
                    {p.isNew && <Badge className="h-4 bg-accent px-1 text-[10px]"><Sparkles className="mr-0.5 h-2.5 w-2.5" />新</Badge>}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.tags.map((tg) => (
                      <span key={tg} className={`rounded px-1.5 py-0.5 text-[10px] ${tg.includes("↑") ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"}`}>
                        {tg}
                      </span>
                    ))}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{p.source}</span>
                    <span>{p.lastVisit}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            </button>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs text-muted-foreground">暂无患者</div>
        )}
      </div>

      <ActionSheet
        open={!!detail}
        onOpenChange={(v) => !v && setDetail(null)}
        title={detail ? `${detail.name} · 患者档案` : ""}
        description={detail ? `${detail.gender} · ${detail.age}岁 · ${detail.source}` : ""}
        footer={
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="h-9 text-xs" onClick={() => toast({ title: "正在呼叫患者" })}>
              <Phone className="mr-1 h-3.5 w-3.5" />联系
            </Button>
            <Button variant="outline" size="sm" className="h-9 text-xs" onClick={() => { setDetail(null); toast({ title: "请录入数据" }); }}>
              <Activity className="mr-1 h-3.5 w-3.5" />录入
            </Button>
            <Button size="sm" className="h-9 bg-warning text-xs hover:bg-warning/90" onClick={() => { toast({ title: "已上转患者" }); setDetail(null); }}>
              <ArrowUpCircle className="mr-1 h-3.5 w-3.5" />上转
            </Button>
          </div>
        }
      >
        {detail && (
          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded bg-muted/40 p-2 text-center">
                <p className="text-muted-foreground">血压</p>
                <p className={`mt-0.5 font-semibold ${detail.abnormal ? "text-destructive" : ""}`}>142/88</p>
              </div>
              <div className="rounded bg-muted/40 p-2 text-center">
                <p className="text-muted-foreground">血糖</p>
                <p className={`mt-0.5 font-semibold ${detail.abnormal ? "text-destructive" : ""}`}>{detail.abnormal ? "12.8" : "6.2"}</p>
              </div>
              <div className="rounded bg-muted/40 p-2 text-center">
                <p className="text-muted-foreground">心率</p>
                <p className="mt-0.5 font-semibold">78</p>
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-medium">主要诊断</p>
              <p className="mt-1 text-muted-foreground">{detail.tags.join(" · ")}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-medium">用药情况</p>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>· 苯磺酸氨氯地平片 5mg / 日</li>
                <li>· 二甲双胍 0.5g / 次,每日 2 次</li>
              </ul>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-medium flex items-center gap-1"><FileText className="h-3 w-3" />医院下转记录</p>
              <p className="mt-1 text-muted-foreground">{detail.source === "医院下转" ? "市第一人民医院 · 出院 3 天 · 建议社区随访每周 1 次" : "社区初诊建档"}</p>
            </div>
          </div>
        )}
      </ActionSheet>
    </div>
  );
};

export default CommunityPatients;
