import { useMemo } from "react";
import { useParams } from "react-router-dom";
import ChatScreen, { ChatMsg, ChatPeer } from "@/components/chat/ChatScreen";

const seedByDoctor: ChatMsg[] = [
  { id: 1, from: "them", text: "李护士，0312床的血压情况如何？", time: "09:12", type: "text" },
  { id: 2, from: "me", text: "王主任，刚刚复测 178/108 mmHg，仍偏高。", time: "09:13", type: "text" },
  { id: 3, from: "them", text: "请加测一次心率和血氧，并复查血压。", time: "09:14", type: "text" },
  { id: 4, from: "me", text: "好的，10 分钟后复测后回报。", time: "09:14", type: "text" },
];

const seedByPatient: ChatMsg[] = [
  { id: 1, from: "them", text: "护士，我现在有点头晕。", time: "09:30", type: "text" },
  { id: 2, from: "me", text: "您先平卧休息，我马上过来。", time: "09:31", type: "text" },
  { id: 3, from: "them", text: "好的谢谢。", time: "09:31", type: "text" },
];

const NurseChat = () => {
  const { type = "doctor" } = useParams();
  const isDoctor = type === "doctor";

  const peer: ChatPeer = useMemo(() => {
    if (isDoctor) return { name: "王主任", sub: "心内科 · 主治医师", phone: "13800138001", isDoctor: true };
    return {
      name: "张伟",
      sub: "床位 0312 · 58岁 · 男",
      phone: "13800138888",
      isDoctor: false,
      abnormal: true,
      diagnosis: "高血压 III 级 · 持续头晕 · 过敏:青霉素",
      vitals: [
        { label: "血压", value: "178/108", abnormal: true },
        { label: "心率", value: "96" },
        { label: "血氧", value: "96%" },
      ],
    };
  }, [isDoctor]);

  return (
    <ChatScreen
      peer={peer}
      initialMessages={isDoctor ? seedByDoctor : seedByPatient}
      gradientClass="bg-gradient-nurse"
    />
  );
};

export default NurseChat;
