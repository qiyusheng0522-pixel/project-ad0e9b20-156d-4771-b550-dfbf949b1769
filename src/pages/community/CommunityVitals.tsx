import { useState } from "react";
import { Activity, Heart, Droplet, AlertTriangle, ArrowUpCircle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import ActionSheet from "@/components/nurse/ActionSheet";

type Mode = "bp" | "glucose";

const recent = [
  { id: 1, name: "李建国", type: "blood-glucose", value: "12.8", unit: "mmol/L", abnormal: true, time: "08:20" },
  { id: 2, name: "刘秀英", type: "blood-pressure", value: "138/86", unit: "mmHg", abnormal: false, time: "07:55" },
  { id: 3, name: "王建军", type: "blood-pressure", value: "162/98", unit: "mmHg", abnormal: true, time: "07:30" },
];

const CommunityVitals = () => {
  const [mode, setMode] = useState<Mode>("bp");
  const [patient, setPatient] = useState("张伟");
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");
  const [glu, setGlu] = useState("");
  const [warn, setWarn] = useState<{ value: string; level: string } | null>(null);
  const [referSheet, setReferSheet] = useState<{ name: string; value: string } | null>(null);

  const submit = () => {
    if (mode === "bp") {
      const s = Number(sys), d = Number(dia);
      if (!s || !d) return toast({ title: "请输入血压数值" });
      if (s >= 160 || d >= 100) {
        setWarn({ value: `${s}/${d} mmHg`, level: "高危" });
      } else if (s >= 140 || d >= 90) {
        setWarn({ value: `${s}/${d} mmHg`, level: "偏高" });
      } else {
        toast({ title: "已录入血压", description: `${s}/${d} mmHg · 正常范围` });
      }
      setSys(""); setDia("");
    } else {
      const v = Number(glu);
      if (!v) return toast({ title: "请输入血糖数值" });
      if (v >= 11.1 || v < 3.9) setWarn({ value: `${v} mmol/L`, level: "高危" });
      else if (v >= 7.0) setWarn({ value: `${v} mmol/L`, level: "偏高" });
      else toast({ title: "已录入血糖", description: `${v} mmol/L · 正常范围` });
      setGlu("");
    }
  };

  return (
    <div className="space-y-3 p-3">
      {/* 切换 */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setMode("bp")}
          className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-medium transition ${
            mode === "bp" ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground"
          }`}
        >
          <Heart className="h-4 w-4" />血压录入
        </button>
        <button
          onClick={() => setMode("glucose")}
          className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-sm font-medium transition ${
            mode === "glucose" ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground"
          }`}
        >
          <Droplet className="h-4 w-4" />血糖录入
        </button>
      </div>

      {/* 录入表单 */}
      <Card className="p-4">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">患者</label>
            <Input value={patient} onChange={(e) => setPatient(e.target.value)} className="h-10" placeholder="选择或输入患者姓名" />
          </div>
          {mode === "bp" ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">收缩压 (mmHg)</label>
                <Input value={sys} onChange={(e) => setSys(e.target.value)} type="number" className="h-10" placeholder="120" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">舒张压 (mmHg)</label>
                <Input value={dia} onChange={(e) => setDia(e.target.value)} type="number" className="h-10" placeholder="80" />
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">血糖 (mmol/L)</label>
              <Input value={glu} onChange={(e) => setGlu(e.target.value)} type="number" step="0.1" className="h-10" placeholder="6.0" />
            </div>
          )}
          <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
            参考范围:{mode === "bp" ? "收缩压 90–139 / 舒张压 60–89 mmHg" : "空腹 3.9–6.1 mmol/L · 餐后 2h <7.8"}
          </div>
          <Button className="h-10 w-full bg-gradient-community" onClick={submit}>
            <CheckCircle2 className="mr-1 h-4 w-4" />提交录入
          </Button>
        </div>
      </Card>

      {/* 近期录入 */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold">近期录入</h3>
          </div>
          <Badge variant="secondary" className="h-5">{recent.length}</Badge>
        </div>
        <div className="divide-y">
          {recent.map((r) => (
            <div key={r.id} className="flex items-center gap-2 px-4 py-2.5">
              <div className={`h-8 w-1 shrink-0 rounded-full ${r.abnormal ? "bg-destructive" : "bg-success"}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.name}</p>
                <p className="text-[11px] text-muted-foreground">{r.time} · {r.type === "blood-pressure" ? "血压" : "血糖"}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${r.abnormal ? "text-destructive" : "text-success"}`}>{r.value}</p>
                <p className="text-[10px] text-muted-foreground">{r.unit}</p>
              </div>
              {r.abnormal && (
                <Button size="sm" variant="outline" className="h-7 border-warning px-2 text-[11px] text-warning hover:bg-warning/10 hover:text-warning" onClick={() => setReferSheet({ name: r.name, value: `${r.value} ${r.unit}` })}>
                  <ArrowUpCircle className="mr-0.5 h-3 w-3" />上转
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* 异常预警弹窗 */}
      <ActionSheet
        open={!!warn}
        onOpenChange={(v) => !v && setWarn(null)}
        title="检测到异常值"
        description={warn ? `${patient} · ${warn.value}` : ""}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => { toast({ title: "已记录,加入观察名单" }); setWarn(null); }}>仅记录</Button>
            <Button className="bg-warning hover:bg-warning/90" onClick={() => { setReferSheet({ name: patient, value: warn?.value ?? "" }); setWarn(null); }}>
              <ArrowUpCircle className="mr-1 h-4 w-4" />一键上转
            </Button>
          </div>
        }
      >
        {warn && (
          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-semibold">{warn.level} · {warn.value}</span>
              </div>
              <p className="mt-1 text-muted-foreground">该数值已超出社区随访范围,建议立即处置或上转上级医院。</p>
            </div>
            <div>
              <p className="mb-1.5 font-medium text-muted-foreground">建议操作</p>
              <ul className="space-y-1">
                <li>· 联系患者复测一次</li>
                <li>· 询问近期用药与症状</li>
                <li>· 如持续异常,一键上转医院</li>
              </ul>
            </div>
          </div>
        )}
      </ActionSheet>

      {/* 一键上转 */}
      <ActionSheet
        open={!!referSheet}
        onOpenChange={(v) => !v && setReferSheet(null)}
        title="一键上转医院"
        description={referSheet ? `${referSheet.name} · ${referSheet.value}` : ""}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setReferSheet(null)}>取消</Button>
            <Button className="bg-warning hover:bg-warning/90" onClick={() => { toast({ title: "已上转", description: "上级医院将在 30 分钟内反馈" }); setReferSheet(null); }}>
              <ArrowUpCircle className="mr-1 h-4 w-4" />确认上转
            </Button>
          </div>
        }
      >
        <div className="space-y-3 py-2 text-xs">
          <div className="rounded-lg bg-muted/40 p-3">
            <p className="font-medium">接收医院 · 内分泌科</p>
            <p className="mt-1 text-muted-foreground">南京市鼓楼医院 · 内分泌科 · 王主任值班</p>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <p className="font-medium">推送内容</p>
            <ul className="mt-1 space-y-1 text-muted-foreground">
              <li>· 异常数值与触发说明</li>
              <li>· 患者基础档案</li>
              <li>· 近 7 日血压 / 血糖记录</li>
              <li>· 用药与过敏史</li>
            </ul>
          </div>
        </div>
      </ActionSheet>
    </div>
  );
};

export default CommunityVitals;
