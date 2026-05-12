import { useMemo } from "react";
import { useParams } from "react-router-dom";
import ChatScreen, { ChatMsg, ChatPeer } from "@/components/chat/ChatScreen";

const seedDoctor: ChatMsg[] = [
  { id: 1, from: "them", text: "请关注李大爷的血糖控制情况。", time: "08:50", type: "text" },
  { id: 2, from: "me", text: "好的王主任，已安排今日加测。", time: "08:52", type: "text" },
];

const seedPatient: ChatMsg[] = [
  { id: 1, from: "them", text: "医生，我最近空腹血糖有点高。", time: "09:10", type: "text" },
  { id: 2, from: "me", text: "请记录一下最近 3 天的数值，我帮您看看。", time: "09:12", type: "text" },
];

const CommunityChat = () => {
  const { type = "patient" } = useParams();
  const isDoctor = type === "doctor";

  const peer: ChatPeer = useMemo(() => {
    if (isDoctor) return { name: "王主任", sub: "鼓楼医院 · 内分泌科", phone: "13800138001", isDoctor: true };
    return {
      name: "李大爷",
      sub: "档案 C0078 · 68岁 · 男",
      phone: "13800138999",
      isDoctor: false,
      abnormal: true,
      diagnosis: "2 型糖尿病 · 周围神经病变 · 过敏:无",
      vitals: [
        { label: "空腹血糖", value: "11.6", abnormal: true },
        { label: "餐后 2h", value: "15.4", abnormal: true },
        { label: "糖化", value: "9.0%" },
      ],
    };
  }, [isDoctor]);

  return (
    <ChatScreen
      peer={peer}
      initialMessages={isDoctor ? seedDoctor : seedPatient}
      gradientClass="bg-gradient-community"
      showReferral={!isDoctor}
    />
  );
};

export default CommunityChat;
