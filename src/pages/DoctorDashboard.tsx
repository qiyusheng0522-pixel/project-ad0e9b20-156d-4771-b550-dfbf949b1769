import { Link } from "react-router-dom";
import {
  ArrowLeft, Stethoscope, Users, ClipboardList, Pill, FileText,
  Clock, AlertCircle, TrendingUp, Calendar, Plus, Search, Bell, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const stats = [
  { label: "今日就诊", value: 28, total: 42, icon: Users, color: "text-primary", bg: "bg-primary/10" },
  { label: "待处理", value: 14, icon: ClipboardList, color: "text-warning", bg: "bg-warning/10" },
  { label: "已开处方", value: 23, icon: Pill, color: "text-accent", bg: "bg-accent/10" },
  { label: "病历完成", value: 25, icon: FileText, color: "text-success", bg: "bg-success/10" },
];

const queue = [
  { no: "001", name: "张伟", age: 45, gender: "男", reason: "复诊 · 高血压", status: "诊中", time: "09:30", priority: "normal" },
  { no: "002", name: "李娜", age: 32, gender: "女", reason: "初诊 · 头痛", status: "候诊", time: "09:45", priority: "normal" },
  { no: "003", name: "王强", age: 67, gender: "男", reason: "复诊 · 糖尿病", status: "候诊", time: "10:00", priority: "urgent" },
  { no: "004", name: "陈敏", age: 28, gender: "女", reason: "初诊 · 体检咨询", status: "候诊", time: "10:15", priority: "normal" },
  { no: "005", name: "赵磊", age: 52, gender: "男", reason: "复诊 · 冠心病", status: "候诊", time: "10:30", priority: "urgent" },
];

const tasks = [
  { title: "审核检验报告", count: 6, color: "text-warning" },
  { title: "回复患者咨询", count: 4, color: "text-primary" },
  { title: "签发处方", count: 3, color: "text-accent" },
  { title: "病历待补充", count: 2, color: "text-destructive" },
];

const DoctorDashboard = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-doctor text-primary-foreground">
              <Stethoscope className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight">医生工作台</h1>
              <p className="text-xs text-muted-foreground">心内科 · 张医生</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索患者/病历" className="w-64 pl-9" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-6 px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="bg-gradient-card p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {s.value}
                    {s.total && <span className="text-sm text-muted-foreground">/{s.total}</span>}
                  </p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Patient Queue */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="font-semibold">今日候诊队列</h2>
                <p className="text-xs text-muted-foreground">实时同步预约系统</p>
              </div>
              <Button size="sm" variant="outline"><Calendar className="mr-1 h-4 w-4" />预约管理</Button>
            </div>
            <div className="divide-y">
              {queue.map((p) => (
                <div key={p.no} className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {p.no}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.gender} · {p.age}岁</span>
                      {p.priority === "urgent" && (
                        <Badge variant="destructive" className="h-5 text-xs">优先</Badge>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">{p.reason}</p>
                  </div>
                  <div className="hidden text-right text-xs text-muted-foreground sm:block">
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.time}</div>
                  </div>
                  <Badge variant={p.status === "诊中" ? "default" : "secondary"}>{p.status}</Badge>
                  <Button size="sm" variant={p.status === "诊中" ? "default" : "outline"}>
                    {p.status === "诊中" ? "继续" : "叫号"}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Side panel */}
          <div className="space-y-6">
            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">待办事项</h2>
                <Badge variant="secondary">{tasks.reduce((a, b) => a + b.count, 0)}</Badge>
              </div>
              <div className="space-y-3">
                {tasks.map((t) => (
                  <div key={t.title} className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                    <div className="flex items-center gap-3">
                      <AlertCircle className={`h-4 w-4 ${t.color}`} />
                      <span className="text-sm">{t.title}</span>
                    </div>
                    <span className={`text-sm font-semibold ${t.color}`}>{t.count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="mb-4 font-semibold">快捷操作</h2>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-auto flex-col gap-1.5 py-3">
                  <Plus className="h-4 w-4" /><span className="text-xs">新建病历</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-1.5 py-3">
                  <Pill className="h-4 w-4" /><span className="text-xs">开具处方</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-1.5 py-3">
                  <FileText className="h-4 w-4" /><span className="text-xs">检查申请</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-1.5 py-3">
                  <TrendingUp className="h-4 w-4" /><span className="text-xs">数据分析</span>
                </Button>
              </div>
            </Card>

            <Card className="bg-gradient-doctor p-5 text-primary-foreground">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="text-sm font-medium">本周诊疗</span>
              </div>
              <p className="mt-3 text-3xl font-bold">186</p>
              <p className="mt-1 text-xs opacity-80">较上周 +12%</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
