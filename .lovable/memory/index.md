# Project Memory

## Core
Medical UI: blue/cyan tones; community端使用 emerald/teal 渐变 (gradient-community)。
Triple-role architecture: Doctor / Nurse / Community terminals; use homepage switcher.
Nurse & Community terminals are mobile-first mini-programs wrapped in iPhone phone-shell.
All popups stay inside the 480px frame (in-frame ActionSheet), never gray out the whole page.

## Memories
- [Medical Theme UI](mem://style/theme) — Medical theme using blue/cyan tones
- [Dual-Role Architecture](mem://architecture/roles) — Doctor / Nurse / Community 三端，首页切换
- [Doctor Workstation](mem://features/doctor-workstation) — Core clinical shortcuts, queue management, and prescribing
- [Nurse Mini-Program](mem://features/nurse-mini-program) — Mobile-first nurse terminal with task and education management
- [Community Mini-Program](mem://features/community-mini-program) — 社区端：接收下转患者、随访看板、血糖血压录入+异常预警、一键上转、消息通知
- [Nursing Plan Audit](mem://logic/nursing-plan-audit) — AI-generated nursing plan with one-click audit/clear
