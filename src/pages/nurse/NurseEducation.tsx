import { useState } from "react";
import { Sparkles, BookOpen, Send, Users, User, TrendingUp, Bell, Search, ChevronRight, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const aiRecommended = [
  { id: 1, title: "高血压日常管理", category: "心血管", match: "98%", views: 142 },
  { id: 2, title: "糖尿病饮食指南", category: "内分泌", match: "95%", views: 218 },
  { id: 3, title: "术后康复运动", category: "康复", match: "92%", views: 87 },
];

const library = [
  { id: 1, title: "心衰自我监测", category: "心血管", duration: "5 min" },
  { id: 2, title: "胰岛素注射规范", category: "内分泌", duration: "3 min" },
  { id: 3, title: "用药安全须知", category: "通用", duration: "4 min" },
  { id: 4, title: "出院后家庭护理", category: "通用", duration: "8 min" },
];

const learners = [
  { id: 1, name: "张伟", bed: "0312", progress: 85, status: "学习中", unread: false },
  { id: 2, name: "李娜", bed: "0508", progress: 100, status: "已完成", unread: false },
  { id: 3, name: "王强", bed: "0215", progress: 0, status: "未开始", unread: true },
  { id: 4, name: "陈敏", bed: "0617", progress: 45, status: "学习中", unread: false },
];

const NurseEducation = () => {
  const [tab, setTab] = useState<"content" | "push" | "monitor">("content");

  return (
    <div className="space-y-4 p-4">
      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
        {[
          { k: "content", label: "宣教内容" },
          { k: "push", label: "宣教推送" },
          { k: "monitor", label: "学习监控" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k as any)}
            className={`rounded-md py-1.5 text-sm font-medium transition-all ${
              tab === t.k ? "bg-card shadow-soft" : "text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <>
          {/* AI 推荐 */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b bg-gradient-to-r from-accent/10 to-transparent px-4 py-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-semibold">AI 推荐宣教</h3>
              </div>
              <Badge className="h-5 bg-accent text-accent-foreground">智能匹配</Badge>
            </div>
            <div className="divide-y">
              {aiRecommended.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <BookOpen className="h-4 w-4 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{c.category} · 已学 {c.views} 人</p>
                  </div>
                  <Badge variant="outline" className="h-5 border-accent text-[10px] text-accent">{c.match}</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* 宣教库 */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">宣教库</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs">全部 <ChevronRight className="ml-0.5 h-3 w-3" /></Button>
            </div>
            <div className="border-b p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索宣教内容" className="h-8 pl-8 text-xs" />
              </div>
            </div>
            <div className="divide-y">
              {library.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Play className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{c.title}</p>
                    <p className="text-[11px] text-muted-foreground">{c.category} · {c.duration}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-accent">推送</Button>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {tab === "push" && (
        <>
          <Card className="p-4">
            <h3 className="mb-3 text-sm font-semibold">推送方式</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => toast({ title: "批量推送成功", description: "已向 36 位患者推送" })}
                className="rounded-xl border-2 border-accent/30 bg-accent/5 p-4 text-left transition-colors hover:bg-accent/10"
              >
                <Users className="mb-2 h-5 w-5 text-accent" />
                <p className="text-sm font-semibold">批量推送</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">按科室/标签</p>
              </button>
              <button
                onClick={() => toast({ title: "已选择单患者推送" })}
                className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10"
              >
                <User className="mb-2 h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">单患者推送</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">个性化推荐</p>
              </button>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b px-4 py-3">
              <h3 className="text-sm font-semibold">最近推送记录</h3>
            </div>
            <div className="divide-y">
              {[
                { title: "高血压日常管理", target: "心内科 · 28 人", time: "10 分钟前", read: 18 },
                { title: "糖尿病饮食指南", target: "内分泌 · 15 人", time: "1 小时前", read: 12 },
                { title: "术后康复运动", target: "外科 · 8 人", time: "今日 09:30", read: 7 },
              ].map((r, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{r.title}</p>
                    <span className="text-[11px] text-muted-foreground">{r.time}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground">{r.target}</p>
                    <Badge variant="secondary" className="h-4 text-[10px]">已读 {r.read}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {tab === "monitor" && (
        <>
          {/* 监控统计 */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3 text-center">
              <TrendingUp className="mx-auto h-4 w-4 text-success" />
              <p className="mt-1 text-lg font-semibold">68%</p>
              <p className="text-[11px] text-muted-foreground">完成率</p>
            </Card>
            <Card className="p-3 text-center">
              <Users className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1 text-lg font-semibold">42</p>
              <p className="text-[11px] text-muted-foreground">参与人数</p>
            </Card>
            <Card className="p-3 text-center">
              <Bell className="mx-auto h-4 w-4 text-warning" />
              <p className="mt-1 text-lg font-semibold">8</p>
              <p className="text-[11px] text-muted-foreground">未读</p>
            </Card>
          </div>

          {/* 学习者进度 */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">学习进度</h3>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => toast({ title: "已发送未读提醒" })}
              >
                <Bell className="mr-1 h-3 w-3" />未读提醒
              </Button>
            </div>
            <div className="divide-y">
              {learners.map((l) => (
                <div key={l.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{l.name}</span>
                      <span className="text-[11px] text-muted-foreground">床 {l.bed}</span>
                      {l.unread && <Badge variant="destructive" className="h-4 px-1 text-[9px]">未读</Badge>}
                    </div>
                    <span className="text-xs text-muted-foreground">{l.status}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${
                          l.progress === 100 ? "bg-success" : l.progress > 0 ? "bg-accent" : "bg-muted-foreground/30"
                        }`}
                        style={{ width: `${l.progress}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-[11px] font-medium">{l.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default NurseEducation;
