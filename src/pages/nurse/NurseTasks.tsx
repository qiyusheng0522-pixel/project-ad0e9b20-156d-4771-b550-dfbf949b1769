import { useState } from "react";
import { Search, Filter, AlertCircle, CheckCircle2, Activity, Bell, ChevronRight, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const patients = [
  { id: 1, name: "张伟", bed: "0312", status: "异常", task: "血压监测", abnormal: true, value: "178/108", metric: "mmHg" },
  { id: 2, name: "李娜", bed: "0508", status: "正常", task: "血糖记录", abnormal: false, value: "6.2", metric: "mmol/L" },
  { id: 3, name: "王强", bed: "0215", status: "异常", task: "心率监测", abnormal: true, value: "118", metric: "bpm" },
  { id: 4, name: "陈敏", bed: "0617", status: "正常", task: "服药打卡", abnormal: false, value: "已完成", metric: "" },
  { id: 5, name: "赵磊", bed: "0419", status: "待处理", task: "护理记录", abnormal: false, value: "待补充", metric: "" },
];

const NurseTasks = () => {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const batchAction = (action: string) => {
    toast({ title: `${action}成功`, description: `已对 ${selected.length} 位患者执行操作` });
    setSelected([]);
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
            { label: "联系患者", icon: Phone },
            { label: "查看现场", icon: Activity },
            { label: "无需处理", icon: CheckCircle2 },
          ].map((a) => (
            <button key={a.label} className="flex flex-col items-center gap-1 rounded-lg p-2 text-xs transition-colors hover:bg-warning/10">
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
          <Input placeholder="搜索患者/床位" className="h-9 pl-8 text-sm" />
        </div>
        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0"><Filter className="h-4 w-4" /></Button>
      </div>

      {/* 批量操作栏 */}
      {selected.length > 0 && (
        <div className="sticky top-2 z-10 flex items-center justify-between rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 shadow-soft">
          <span className="text-sm font-medium">已选 {selected.length} 项</span>
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => batchAction("批量提醒")}><Bell className="mr-1 h-3 w-3" />提醒</Button>
            <Button size="sm" className="h-7 bg-gradient-nurse text-xs" onClick={() => batchAction("批量完成")}><CheckCircle2 className="mr-1 h-3 w-3" />完成</Button>
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
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold">{p.bed}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium">{p.name}</span>
                  {p.abnormal && <Badge variant="destructive" className="h-4 px-1 text-[9px]">异常</Badge>}
                </div>
                <p className="truncate text-[11px] text-muted-foreground">{p.task} · {p.value}{p.metric && ` ${p.metric}`}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </Card>

      {/* 一键提醒 */}
      <Button className="w-full bg-gradient-nurse" size="lg">
        <Bell className="mr-2 h-4 w-4" />一键提醒所有未完成患者
      </Button>
    </div>
  );
};

export default NurseTasks;
