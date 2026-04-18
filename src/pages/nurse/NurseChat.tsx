import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Send, Phone, Image as ImageIcon, Mic, Smile, Stethoscope, User, Paperclip, MoreVertical, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

type Msg = {
  id: number;
  from: "me" | "them";
  text?: string;
  type?: "text" | "image" | "voice" | "vitals";
  time: string;
  meta?: string;
};

const seedByDoctor: Msg[] = [
  { id: 1, from: "them", text: "李护士，0312床的血压情况如何？", time: "09:12", type: "text" },
  { id: 2, from: "me", text: "王主任，刚刚复测 178/108 mmHg，仍偏高。", time: "09:13", type: "text" },
  { id: 3, from: "them", text: "请加测一次心率和血氧，并复查血压。", time: "09:14", type: "text" },
  { id: 4, from: "me", text: "好的，10 分钟后复测后回报。", time: "09:14", type: "text" },
];

const seedByPatient: Msg[] = [
  { id: 1, from: "them", text: "护士，我现在有点头晕。", time: "09:30", type: "text" },
  { id: 2, from: "me", text: "您先平卧休息，我马上过来。", time: "09:31", type: "text" },
  { id: 3, from: "them", text: "好的谢谢。", time: "09:31", type: "text" },
];

const presets = ["请稍等，马上到", "请保持休息", "已通知医生", "请按时服药"];

const NurseChat = () => {
  const { type = "doctor", id = "1" } = useParams();
  const navigate = useNavigate();
  const isDoctor = type === "doctor";

  const peer = useMemo(() => {
    if (isDoctor) return { name: "王主任", sub: "心内科 · 主治医师", phone: "13800138001" };
    return { name: "张伟", sub: "床位 0312 · 58岁 · 男", phone: "13800138888" };
  }, [isDoctor]);

  const [messages, setMessages] = useState<Msg[]>(isDoctor ? seedByDoctor : seedByPatient);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((m) => [...m, { id: Date.now(), from: "me", text: value, time, type: "text" }]);
    setInput("");
  };

  const sendVitals = () => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((m) => [
      ...m,
      {
        id: Date.now(),
        from: "me",
        type: "vitals",
        text: "血压 178/108 mmHg · 心率 96 bpm · 血氧 96%",
        meta: "刚刚测量",
        time,
      },
    ]);
    toast({ title: "已发送生命体征卡片" });
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-muted/30">
      {/* Header (and replaces NurseLayout header for this page) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-gradient-nurse px-3 py-2.5 text-primary-foreground">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="rounded p-1 hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            {isDoctor ? <Stethoscope className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{peer.name}</p>
            <p className="text-[11px] opacity-80">{peer.sub}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => toast({ title: "正在呼叫", description: `${peer.name} · ${peer.phone}` })}
            className="rounded-full p-1.5 hover:bg-white/10"
          >
            <Phone className="h-4 w-4" />
          </button>
          <button className="rounded-full p-1.5 hover:bg-white/10">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Patient quick-info banner (shown when chatting with patient) */}
      {!isDoctor && (
        <div className="border-b bg-card px-4 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">主诉</span>
            <Badge variant="destructive" className="h-4 px-1 text-[10px]">异常</Badge>
          </div>
          <p className="mt-1 text-xs">高血压 III 级 · 持续头晕 · 过敏:青霉素</p>
          <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
            <div className="rounded bg-destructive/10 px-2 py-1 text-center">
              <p className="text-muted-foreground">血压</p>
              <p className="font-semibold text-destructive">178/108</p>
            </div>
            <div className="rounded bg-muted px-2 py-1 text-center">
              <p className="text-muted-foreground">心率</p>
              <p className="font-semibold">96</p>
            </div>
            <div className="rounded bg-muted px-2 py-1 text-center">
              <p className="text-muted-foreground">血氧</p>
              <p className="font-semibold">96%</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
        <p className="text-center text-[10px] text-muted-foreground">今日 {messages[0]?.time}</p>
        {messages.map((m) => (
          <div key={m.id} className={`flex items-end gap-2 ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            {m.from === "them" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                {isDoctor ? <Stethoscope className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
              </div>
            )}
            <div className={`max-w-[75%] ${m.from === "me" ? "items-end" : "items-start"} flex flex-col`}>
              {m.type === "vitals" ? (
                <div className="rounded-2xl border bg-card p-3 text-xs shadow-soft">
                  <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-accent">体征快照</p>
                  <p className="font-medium">{m.text}</p>
                  {m.meta && <p className="mt-1 text-[10px] text-muted-foreground">{m.meta}</p>}
                </div>
              ) : (
                <div
                  className={`rounded-2xl px-3 py-2 text-sm leading-snug ${
                    m.from === "me"
                      ? "bg-gradient-nurse text-primary-foreground"
                      : "bg-card text-foreground shadow-soft"
                  }`}
                >
                  {m.text}
                </div>
              )}
              <span className="mt-1 text-[10px] text-muted-foreground">{m.time}</span>
            </div>
            {m.from === "me" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick replies */}
      <div className="flex gap-2 overflow-x-auto border-t bg-card/60 px-3 py-2">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            className="shrink-0 rounded-full border bg-background px-3 py-1 text-[11px] text-muted-foreground hover:border-accent hover:text-accent"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="sticky bottom-0 border-t bg-card px-2 py-2">
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={sendVitals}>
            <Plus className="h-5 w-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="输入消息..."
            className="h-9 flex-1"
          />
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            className="h-9 w-9 shrink-0 bg-gradient-nurse"
            onClick={() => send()}
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 flex items-center justify-around text-[10px] text-muted-foreground">
          <button className="flex items-center gap-1"><ImageIcon className="h-3 w-3" />图片</button>
          <button className="flex items-center gap-1"><Mic className="h-3 w-3" />语音</button>
          <button className="flex items-center gap-1" onClick={sendVitals}><Paperclip className="h-3 w-3" />体征卡片</button>
        </div>
      </div>
    </div>
  );
};

export default NurseChat;
