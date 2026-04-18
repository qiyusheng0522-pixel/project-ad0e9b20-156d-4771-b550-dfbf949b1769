# Project Memory

## Core
Medical UI: blue/cyan tones.
Dual-role architecture: Doctor and Nurse terminals; use homepage switcher.
Nurse terminal is a mobile-first mini-program. All popups stay inside the 480px frame (in-frame ActionSheet), never gray out the whole page.
Nurse "联系医生 / 联系患者" buttons navigate to /nurse/chat/:type/:id, NOT toast.

## Memories
- [Medical Theme UI](mem://style/theme) — Medical theme using blue/cyan tones
- [Dual-Role Architecture](mem://architecture/roles) — Dual-role system (Doctor/Nurse) with homepage switcher
- [Doctor Workstation](mem://features/doctor-workstation) — Core clinical shortcuts, queue management, and prescribing
- [Nurse Mini-Program](mem://features/nurse-mini-program) — Mobile-first nurse terminal with task and education management
- [Nursing Plan Audit](mem://logic/nursing-plan-audit) — AI-generated nursing plan with one-click audit/clear
