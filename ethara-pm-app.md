# Implementation Plan: Ethara Project Manager

A production-ready project management application with role-based access control, JWT authentication, and PostgreSQL database, optimized for Railway deployment.

## 📋 Overview
- **Goal:** Build a secure, scalable PM tool where Admins manage teams/projects and Members focus on their assigned tasks.
- **Project Type:** WEB (Full-stack)
- **Primary Agent:** `orchestrator`
- **Timeline:** 8-12 Hours (Production-ready)

## 🎯 Success Criteria
- [ ] **Secure Auth:** JWT-based login/signup with bcrypt hashing.
- [ ] **RBAC Enforcement:** Middleware strictly separates Admin and Member capabilities.
- [ ] **Project/Task CRUD:** Full lifecycle management for projects and nested tasks.
- [ ] **Modern UI:** Responsive Tailwind CSS design with Lucide icons and smooth transitions.
- [ ] **Railway Ready:** One-click deployment config with `railway.json` and `schema.sql`.
- [ ] **Quality Audit:** Zero critical security issues and 90+ Lighthouse score.

## 💻 Tech Stack
- **Backend:** Node.js + Express + `pg` (Postgres)
- **Frontend:** React + Vite + Tailwind CSS + Lucide React
- **Auth:** JWT + bcryptjs
- **Database:** PostgreSQL
- **Deployment:** Railway

## 📁 File Structure
```plaintext
ethara-pm/
├── backend/
│   ├── src/
│   │   ├── config/          # DB & Auth config
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth & RBAC guards
│   │   ├── models/          # SQL queries/logic
│   │   ├── routes/          # API endpoints
│   │   └── utils/           # Helpers
│   ├── .env.example
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # UI primitives & patterns
│   │   ├── context/         # Auth & Global state
│   │   ├── hooks/           # API integration
│   │   ├── pages/           # Screen definitions
│   │   └── services/        # Axios API clients
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
├── schema.sql               # Database initialization
├── railway.json             # Railway deployment config
├── Procfile                 # Process manager config
└── README.md                # Documentation
```

## 🛠️ Task Breakdown

### Phase 1: Foundation (P0)
| Task ID | Name | Agent | Skills | Priority | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T1 | Monorepo & Base Config | `project-planner` | `app-builder` | P0 | None |
| T2 | PostgreSQL Schema Design | `database-architect`| `database-design` | P0 | T1 |
| T3 | Auth System (Backend) | `backend-specialist`| `api-patterns` | P0 | T2 |

### Phase 2: Backend Core (P1)
| Task ID | Name | Agent | Skills | Priority | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T4 | Project API & RBAC | `backend-specialist`| `nodejs-best-practices`| P1 | T3 |
| T5 | Task API & Assignments | `backend-specialist`| `api-patterns` | P1 | T4 |

### Phase 3: Frontend Development (P2)
| Task ID | Name | Agent | Skills | Priority | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T6 | Design System & Auth UI | `frontend-specialist`| `frontend-design` | P2 | T3 |
| T7 | Project & Team Dashboard | `frontend-specialist`| `tailwind-patterns` | P2 | T6, T4 |
| T8 | Task Board & Management | `frontend-specialist`| `react-best-practices`| P2 | T7, T5 |

### Phase 4: Deployment & Polish (P3)
| Task ID | Name | Agent | Skills | Priority | Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- |
| T9 | Railway Config & Docs | `devops-engineer` | `deployment-procedures`| P3 | T8 |
| T10| Final Audit & Verification| `test-engineer` | `webapp-testing` | P3 | T9 |

## 🧪 Phase X: Final Verification
- [ ] **Security:** Run `python .agent/scripts/checklist.py .`
- [ ] **Performance:** Run `python .agent/scripts/verify_all.py .`
- [ ] **Build:** `npm run build` in both directories passes.
- [ ] **RBAC Check:** Manually verify Member cannot delete Projects.

## ✅ PHASE X COMPLETE
- Lint: [ ]
- Security: [ ]
- Build: [ ]
- Date: [2026-05-03]
