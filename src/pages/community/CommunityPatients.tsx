import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Sparkles, FileText, Phone, Activity, ChevronRight, ArrowUpCircle, Globe, CheckCircle2 } from "lucide-react";
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
  source: "南京市鼓楼医院" | "兰园社区";
  isNew?: boolean;
  abnormal?: boolean;
  uploaded?: boolean;
  lastVisit: string;
};

const seed: Patient[] = [
  { id: 1, name: "张伟", age: 58, gender: "男", tags: ["2 型糖尿病", "出院 3 天"], source: "南京市鼓楼医院", isNew: true, lastVisit: "今日下转" },
  { id: 2, name: "李建国", age: 62, gender: "男", tags: ["2 型糖尿病", "血糖↑"], source: "兰园社区", abnormal: true, lastVisit: "1 小时前" },
  { id: 3, name: "刘秀英", age: 67, gender: "女", tags: ["桥本甲状腺炎"], source: "兰园社区", lastVisit: "3 天前" },
  { id: 4, name: "陈敏", age: 55, gender: "女", tags: ["1 型糖尿病"], source: "南京市鼓楼医院", isNew: true, lastVisit: "今日下转" },
  { id: 5, name: "周春华", age: 71, gender: "女", tags: ["糖尿病酮症", "血糖↑"], source: "兰园社区", abnormal: true, lastVisit: "30 分钟前" },
];

const tabs = [
  { key: "all", label: "全部" },
  { key: "new", label: "新接收" },
  { key: "abnormal", label: "异常" },
];

const CommunityPatients = () => {
  const [params] = useSearchParams();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [list, setList] = useState(seed);
  const [detail, setDetail] = useState<Patient | null>(null);
  const [uploadFor, setUploadFor] = useState<Patient | null>(null);
  const [uploadResult, setUploadResult] = useState<Patient | null>(null);

  useEffect(() => {
    const t = params.get("tab");
    if (t) setTab(t);
  }, [params]);

  const filtered = list.filter((p) => {
    if (tab === "new" && !p.isNew) return false;
    if (tab === "abnormal" && !p.abnormal) return false;
    if (q && !p.name.includes(q)) return false;
    return true;
  });

  const newCount = list.filter((p) => p.isNew).length;
  const abnCount = list.filter((p) => p.abnormal).length;

  const confirmUpload = () => {
    if (!uploadFor) return;
    setList((all) => all.map((x) => (x.id === uploadFor.id ? { ...x, uploaded: true } : x)));
    setUploadResult(uploadFor);
    setUploadFor(null);
    setDetail(null);
  };

  const sourceClass = (s: Patient["source"]) =>
    s === "南京市鼓楼医院" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent";

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
            {t.key === "new" && newCount > 0 && <span className="ml-1 rounded bg-accent/20 px-1 text-[10px]">{newCount}</span>}
            {t.key === "abnormal" && abnCount > 0 && <span className="ml-1 rounded bg-destructive/20 px-1 text-[10px] text-destructive">{abnCount}</span>}
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
                    {p.uploaded && <Badge variant="outline" className="h-4 border-primary px-1 text-[10px] text-primary">已上转</Badge>}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${sourceClass(p.source)}`}>
                      {p.source === "南京市鼓楼医院" ? "鼓楼" : "兰园社区"}
                    </span>
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

      {/* 患者详情 */}
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
            <Button size="sm" className="h-9 bg-warning text-xs hover:bg-warning/90" onClick={() => detail && setUploadFor(detail)}>
              <ArrowUpCircle className="mr-1 h-3.5 w-3.5" />上传鼓楼
            </Button>
          </div>
        }
      >
        {detail && (
          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded bg-muted/40 p-2 text-center">
                <p className="text-muted-foreground">空腹血糖</p>
                <p className={`mt-0.5 font-semibold ${detail.abnormal ? "text-destructive" : ""}`}>{detail.abnormal ? "10.6" : "6.2"}</p>
              </div>
              <div className="rounded bg-muted/40 p-2 text-center">
                <p className="text-muted-foreground">糖化</p>
                <p className={`mt-0.5 font-semibold ${detail.abnormal ? "text-destructive" : ""}`}>{detail.abnormal ? "9.1%" : "6.8%"}</p>
              </div>
              <div className="rounded bg-muted/40 p-2 text-center">
                <p className="text-muted-foreground">TSH</p>
                <p className="mt-0.5 font-semibold">2.4</p>
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-medium">主要诊断</p>
              <p className="mt-1 text-muted-foreground">{detail.tags.join(" · ")}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-medium">用药情况</p>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>· 二甲双胍 0.5g / 次,每日 3 次</li>
                <li>· 甘精胰岛素 16U 睡前皮下</li>
              </ul>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-medium flex items-center gap-1"><FileText className="h-3 w-3" />来源记录</p>
              <p className="mt-1 text-muted-foreground">{detail.source === "南京市鼓楼医院" ? "南京市鼓楼医院 · 出院 3 天 · 建议社区随访每周 1 次" : "兰园社区初诊建档"}</p>
            </div>
          </div>
        )}
      </ActionSheet>

      {/* 上传确认 */}
      <ActionSheet
        open={!!uploadFor}
        onOpenChange={(v) => !v && setUploadFor(null)}
        title="上传至南京市鼓楼医院"
        description={uploadFor ? `将 ${uploadFor.name} 的档案与近 7 日数据推送至鼓楼医院 · 内分泌科` : ""}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setUploadFor(null)}>取消</Button>
            <Button className="bg-gradient-community" onClick={confirmUpload}>
              <ArrowUpCircle className="mr-1 h-4 w-4" />确认上传
            </Button>
          </div>
        }
      >
        {uploadFor && (
          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-lg bg-muted/40 p-3">
              <p className="font-medium">接收科室</p>
              <p className="mt-1 text-muted-foreground">南京市鼓楼医院 · 内分泌科</p>
            </div>
            <div className="rounded-lg bg-muted/40 p-3">
              <p className="font-medium">推送内容</p>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>· 患者基础档案</li>
                <li>· 近 7 日血压 / 血糖记录</li>
                <li>· 用药与过敏史</li>
                <li>· 本次上传说明</li>
              </ul>
            </div>
          </div>
        )}
      </ActionSheet>

      {/* 上传成功 + 互联网医院入口推荐 */}
      <ActionSheet
        open={!!uploadResult}
        onOpenChange={(v) => !v && setUploadResult(null)}
        title="已成功上传"
        description={uploadResult ? `${uploadResult.name} 的档案已同步至鼓楼医院` : ""}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setUploadResult(null)}>稍后</Button>
            <Button className="bg-gradient-community" onClick={() => { toast({ title: "已优先推荐至鼓楼医院互联网医院" }); setUploadResult(null); }}>
              <Globe className="mr-1 h-4 w-4" />进入互联网医院
            </Button>
          </div>
        }
      >
        {uploadResult && (
          <div className="space-y-3 py-2 text-xs">
            <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-success">
              <CheckCircle2 className="h-4 w-4" />
              <span>档案已同步至 南京市鼓楼医院 · 内分泌科</span>
            </div>
            <div className="rounded-lg border p-3">
              <p className="flex items-center gap-1 font-medium text-primary">
                <Globe className="h-3.5 w-3.5" />优先推荐 · 鼓楼医院互联网医院
              </p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>· 接诊医生:王主任(内分泌科)</li>
                <li>· 在线复诊 / 续方 / 结果咨询</li>
                <li>· 患者可凭档案直接预约 24h 内号源</li>
              </ul>
            </div>
          </div>
        )}
      </ActionSheet>
    </div>
  );
};

export default CommunityPatients;
