export type EduContent = {
  id: number;
  title: string;
  category: string;
  duration: string;
  desc?: string;
};

export const eduLibrary: EduContent[] = [
  { id: 1, title: "高血压日常管理", category: "心血管", duration: "5 min", desc: "血压监测要点、低盐饮食与用药依从性提醒。" },
  { id: 2, title: "心衰自我监测", category: "心血管", duration: "5 min", desc: "每日记录体重、尿量与下肢水肿,识别早期信号。" },
  { id: 3, title: "糖尿病饮食指南", category: "内分泌", duration: "6 min", desc: "三餐搭配、升糖指数与加餐建议。" },
  { id: 4, title: "胰岛素注射规范", category: "内分泌", duration: "3 min", desc: "标准注射部位轮换、剂量核对与低血糖应急。" },
  { id: 5, title: "术后康复运动", category: "康复", duration: "4 min", desc: "分阶段康复动作演示与禁忌运动说明。" },
  { id: 6, title: "用药安全须知", category: "通用", duration: "4 min", desc: "服药时间提醒、禁忌组合、漏服补救。" },
  { id: 7, title: "出院后家庭护理", category: "通用", duration: "8 min", desc: "居家环境改造、跌倒预防、家属协助要点。" },
];

export const eduByCategory = (): Record<string, EduContent[]> => {
  return eduLibrary.reduce((acc, c) => {
    (acc[c.category] ||= []).push(c);
    return acc;
  }, {} as Record<string, EduContent[]>);
};
