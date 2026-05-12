export type FollowupStatus = "待随访" | "需复访" | "已完成";

export type FollowupPatient = {
  id: number;
  name: string;
  status: FollowupStatus;
  surgery: string;
  postOpDay?: number;
  note?: string;
};

export const followupList: FollowupPatient[] = [
  { id: 11, name: "韩启航", status: "待随访", surgery: "髌骨关节疼痛综合征", postOpDay: 3 },
  { id: 12, name: "王晓彤", status: "待随访", surgery: "右肩冲击综合征", postOpDay: 5 },
  { id: 13, name: "杨成轩", status: "待随访", surgery: "左跟腱缝合术", postOpDay: 7 },
  { id: 14, name: "胡国玉", status: "待随访", surgery: "右膝 PCL 重建", postOpDay: 9 },
  { id: 15, name: "何宗兰", status: "已完成", surgery: "左肩关节镜肩袖修补 · 肩外展 90°,恢复良好", postOpDay: 14 },
  { id: 16, name: "范芳进", status: "需复访", surgery: "右膝半月板修补 · 复诊建议", postOpDay: 21 },
];

export const followupStats = () => {
  const c = (s: FollowupStatus) => followupList.filter((p) => p.status === s).length;
  return {
    total: followupList.length,
    pending: c("待随访"),
    recheck: c("需复访"),
    done: c("已完成"),
  };
};
