# Application Architecture — Forty Years of Fees

## Greenwich University, Karachi (Journey 40: 1987–2026)

This document outlines the three-tier monorepo architecture powering the **Forty Years of Fees** research and financial analytics platform.

---

## 1. System Topology

```text
forty-years-of-fees/
│
├── frontend/                  # Public Research Website (Port 5173)
│   ├── React 19, Vite 6, Tailwind CSS v4, Recharts, Lucide React
│   └── Multi-page responsive research journal and interactive dashboards
│
├── admin/                     # Institutional Admin Dashboard (Port 5174)
│   ├── React 19, Vite 6, Tailwind CSS v4, Recharts, Lucide React
│   └── Full CRUD management, CSV bulk import/export, RBAC, and AI Assistant
│
├── backend/                   # RESTful API Server (Port 5000)
│   ├── Node.js, Express 5, MongoDB / Mongoose, JWT, Helmet, Rate Limiter
│   ├── Econometric Calculation Engine (Real fees, CAGR, Inflation)
│   └── Google Gemini 2.5 Flash integration via Official SDK
│
└── docs/                      # Technical & Econometric Documentation
```

---

## 2. Ports and Communications

| Sub-System | Default Port | Internal Proxy | Description |
|---|---|---|---|
| **Backend API** | `5000` | — | Core REST API and MongoDB communication |
| **Frontend** | `5173` | `/api -> :5000` | Publicly accessible institutional site |
| **Admin Panel** | `5174` | `/api -> :5000` | Authenticated admin & researcher workspace |

---

## 3. Data Flow Architecture

```text
Visitor / Researcher / Admin
            │
            ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│   Frontend (Port 5173)   │       │    Admin (Port 5174)    │
└────────────┬────────────┘       └────────────┬────────────┘
             │                                 │
             └────────────────┬────────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │  Backend API (:5000)    │
                 │  - Helmet & CORS        │
                 │  - JWT & Role Auth      │
                 │  - Rate Limiter         │
                 └────────────┬────────────┘
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│     MongoDB Atlas       │       │    Google Gemini AI     │
│   - Programmes (10)     │       │  - Zero Hallucination   │
│   - 400 Annual Fees     │       │  - Structured JSON      │
│   - 40-Year PBS CPI     │       │  - Econometric Prompts  │
│   - Audit Logs          │       └─────────────────────────┘
└─────────────────────────┘
```

---

## 4. Key Security Mechanisms

1. **Strict Role-Based Access Control (RBAC):**
   - `SUPER_ADMIN`: User management, complete data modification, audit trail inspection.
   - `ADMIN`: Programme management, fee records, CPI series, archival sources.
   - `RESEARCHER`: Educational philanthropy monographs, AI report synthesis.
   - `VIEWER`: Read-only access to administration statistics.

2. **Audit Logging:**
   - Every write, update, delete, and import is logged with timestamp, actor ID, and IP address in an immutable audit collection.

3. **Rate Limiting:**
   - Standard API endpoints: 300 requests / 15 minutes.
   - AI endpoints: 30 queries / 5 minutes to protect API quotas.
