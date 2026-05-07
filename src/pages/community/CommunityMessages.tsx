import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, AlertTriangle, ArrowUpCircle, CheckCircle2, ChevronRight, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ActionSheet from "@/components/nurse/ActionSheet";
import { toast } from "@/hooks/use-toast";

type Msg = {
  id: number;
  type: "new-patient" | "alert" | "refer-result" | "system";
  title: string;
  desc: string;
  time: string;
  unread: boolean;
};

const initial: Msg[] = [
  { id: 1, type: "new-patient", title: "收到新患者", desc: "南京市鼓楼医院下转 张伟,请及时建档随访", time: "刚刚", unread: true },
  { id: 2, type: "alert", title: "异常值预警", desc: "李建国 空腹血糖 12.8 mmol/L,请立即处置", time: "10 分钟前", unread: true },
  { id: 3, type: "refer-result", title: "上转结果反馈", desc: "王建军 已被南京市鼓楼医院内分泌科接收,预约明日 9:00 门诊", time: "1 小时前", unread: true },
  { id: 4, type: "new-patient", title: "收到新患者", desc: "南京市鼓楼医院下转 陈敏,心律失常观察", time: "2 小时前", unread: true },
  { id: 5, type: "system", title: "随访提醒", desc: "今日有 3 位患者待随访", time: "今早 8:00", unread: false },
];

const meta = {
  "new-patient": { icon: Sparkles, color: "text-accent", bg: "bg-accent/15" },
  "alert": { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/15" },
  "refer-result": { icon: ArrowUpCircle, color: "text-warning", bg: "bg-warning/15" },
  "system": { icon: Bell, color: "text-primary", bg: "bg-primary/15" },
} as const;

const CommunityMessages = () => {
  const navigate = useNavigate();
  const [msgs, setMsgs] = useState(initial);
  const [active, setActive] = useState<Msg | null>(null);

  const open = (m: Msg) => {
    setActive(m);
    setMsgs((prev) => prev.map((x) => (x.id === m.id ? { ...x, unread: false } : x)));
  };

  const markAll = () => {
    setMsgs((prev) => prev.map((x) => ({ ...x, unread: false })));
    toast({ title: "已全部标为已读" });
  };

  const handleAction = (m: Msg) => {
    setActive(null);
    if (m.type === "new-patient") navigate("/community/patients?tab=new");
    else if (m.type === "alert") navigate("/community");
    else if (m.type === "refer-result") toast({ title: "查看上转详情" });
  };

  const unreadCount = msgs.filter((m) => m.unread).length;

  return (
    <div className="space-y-3 p-3">
      <Card className="flex items-center justify-between p-3">
        <div>
          <p className="text-sm font-semibold">消息中心</p>
          <p className="text-[11px] text-muted-foreground">未读 {unreadCount} · 共 {msgs.length} 条</p>
        </div>
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={markAll} disabled={!unreadCount}>
          <CheckCircle2 className="mr-1 h-3 w-3" />全部已读
        </Button>
      </Card>

      <div className="space-y-2">
        {msgs.map((m) => {
          const M = meta[m.type];
          return (
            <Card key={m.id} className={`overflow-hidden ${m.unread ? "border-accent/40" : ""}`}>
              <button onClick={() => open(m)} className="flex w-full items-start gap-3 p-3 text-left">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${M.bg} ${M.color}`}>
                  <M.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-medium">{m.title}</p>
                    {m.unread && <span className="h-1.5 w-1.5 rounded-full bg-destructive" />}
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{m.desc}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{m.time}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            </Card>
          );
        })}
      </div>

      <ActionSheet
        open={!!active}
        onOpenChange={(v) => !v && setActive(null)}
        title={active?.title ?? ""}
        description={active?.time}
        footer={
          active && (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setActive(null)}>关闭</Button>
              <Button className="bg-gradient-community" onClick={() => handleAction(active)}>
                {active.type === "new-patient" ? "去建档" : active.type === "alert" ? "去处置" : active.type === "refer-result" ? "查看详情" : "知道了"}
              </Button>
            </div>
          )
        }
      >
        {active && (
          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-lg bg-muted/40 p-3">
              <Badge variant="secondary" className="h-5 text-[10px]">
                {active.type === "new-patient" ? "新患者" : active.type === "alert" ? "预警" : active.type === "refer-result" ? "上转反馈" : "系统"}
              </Badge>
              <p className="mt-2 text-foreground">{active.desc}</p>
            </div>
            {active.type === "refer-result" && (
              <div className="rounded-lg border p-3">
                <p className="font-medium">医院反馈详情</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  <li>· 接收科室:心内科</li>
                  <li>· 接诊医生:王主任</li>
                  <li>· 预约时间:明日 09:00</li>
                  <li>· 备注:请携带近 7 日数据记录</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </ActionSheet>
    </div>
  );
};

export default CommunityMessages;
