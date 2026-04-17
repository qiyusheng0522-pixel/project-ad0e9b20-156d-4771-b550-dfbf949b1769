import { useState } from "react";
import { LogOut, FileText, Send, History, ChevronRight, User, CheckCircle2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const dischargeList = [
  { id: 1, name: "王芳", bed: "0408", date: "今日 14:00", status: "待交接", doctor: "张医生" },
  { id: 2, name: "刘洋", bed: "0612", date: "今日 16:30", status: "准备中", doctor: "李医生" },
  { id: 3, name: "周婷", bed: "0305", date: "明日 09:00", status: "待交接", doctor: "王医生" },
];

const history = [
  { id: 1, name: "陈雪", bed: "0507", date: "昨日 10:30", receiver: "社区护士 · 张丽", status: "已完成" },
  { id: 2, name: "黄伟", bed: "0218", date: "昨日 15:00", receiver: "家属 · 黄先生", status: "已完成" },
];

const NurseHandover = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [selected, setSelected] = useState<typeof dischargeList[0] | null>(null);
  const [note, setNote] = useState("");

  if (selected) {
    return (
      <div className="space-y-4 p-4">
        <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground">
          ← 返回列表
        </button>

        {/* 患者信息 */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-nurse text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{selected.name}</p>
              <p className="text-xs text-muted-foreground">床位 {selected.bed} · 主治 {selected.doctor}</p>
            </div>
            <Badge variant="secondary">{selected.date}</Badge>
          </div>
        </Card>

        {/* 交接准备 */}
        <Card className="overflow-hidden">
          <div className="border-b bg-muted/30 px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">交接准备</span>
            </div>
          </div>
          <div className="space-y-3 p-4">
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">护理记录汇总</p>
              <div className="rounded-lg bg-muted/40 p-3 text-xs leading-relaxed">
                住院 5 天,血压控制平稳(140/85 mmHg),无不良反应。已完成出院宣教及用药指导。建议社区随访每周一次。
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">交接内容(自动生成)</p>
              <div className="space-y-1.5">
                {["用药清单 · 5 项", "复查计划 · 2 周后", "饮食运动建议", "应急联系方式"].map((it) => (
                  <div key={it} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    <span>{it}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">补充说明</p>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="可补充交接事项..."
                className="min-h-[70px] text-xs"
              />
            </div>
          </div>
        </Card>

        {/* 一键交接 */}
        <Card className="overflow-hidden">
          <div className="border-b bg-muted/30 px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <Send className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold">一键交接</span>
            </div>
          </div>
          <div className="space-y-3 p-4">
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">选择接收人</p>
              <div className="grid grid-cols-2 gap-2">
                {["社区护士", "家属", "转入科室", "康复中心"].map((r) => (
                  <button key={r} className="rounded-lg border bg-card p-2.5 text-xs transition-colors hover:border-accent hover:bg-accent/5">
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <Button
              className="w-full bg-gradient-nurse"
              size="lg"
              onClick={() => {
                toast({ title: "交接发送成功", description: `${selected.name} 的交接信息已发送` });
                setSelected(null);
              }}
            >
              <Send className="mr-2 h-4 w-4" />发送交接
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Tab 切换 */}
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
        <button
          onClick={() => setActiveTab("pending")}
          className={`rounded-md py-1.5 text-sm font-medium transition-all ${
            activeTab === "pending" ? "bg-card shadow-soft" : "text-muted-foreground"
          }`}
        >
          出院列表
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`rounded-md py-1.5 text-sm font-medium transition-all ${
            activeTab === "history" ? "bg-card shadow-soft" : "text-muted-foreground"
          }`}
        >
          交接记录
        </button>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center">
          <p className="text-xl font-semibold text-primary">3</p>
          <p className="text-[11px] text-muted-foreground">今日出院</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-semibold text-warning">2</p>
          <p className="text-[11px] text-muted-foreground">待交接</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-semibold text-success">12</p>
          <p className="text-[11px] text-muted-foreground">本周完成</p>
        </Card>
      </div>

      {/* 列表 */}
      {activeTab === "pending" ? (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-1.5">
              <LogOut className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">出院待交接</h3>
            </div>
          </div>
          <div className="divide-y">
            {dischargeList.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                  {p.bed}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{p.name}</span>
                    <Badge variant={p.status === "待交接" ? "destructive" : "secondary"} className="h-4 px-1 text-[9px]">{p.status}</Badge>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">出院 · {p.date}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-1.5">
              <History className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">历史交接记录</h3>
            </div>
          </div>
          <div className="divide-y">
            {history.map((h) => (
              <div key={h.id} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{h.name} · 床 {h.bed}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">接收人:{h.receiver}</p>
                  </div>
                  <Badge variant="outline" className="h-5 border-success text-[10px] text-success">
                    <CheckCircle2 className="mr-0.5 h-2.5 w-2.5" />{h.status}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />{h.date}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default NurseHandover;
