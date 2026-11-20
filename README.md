# Forty Years of Fees (1987–2027)
## Greenwich University, Karachi — Journey 40 Research Platform

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini_2.5_Flash-orange.svg)](https://ai.google.dev/)

An institutional research monograph and interactive financial analytics platform developed for **Greenwich University, Karachi**, as part of its **Journey 40** initiative.

Exploring four decades of higher education fees, purchasing power, PBS inflation, and the changing economics of tertiary education in Karachi from **1987 through 2027**.

---

## 🏛️ Project Overview

Because continuous official historical fee records covering all 40 years are not unified, this platform integrates a complete, reproducible **synthetic 40-year dataset** benchmarked against Pakistan Bureau of Statistics (PBS) CPI deflators, while offering an administrative workflow for verified historical records to supersede simulated estimates in-place.

### Core Research Themes:
1. **Nominal vs Real Fees:** How nominal fee increases compare against purchasing power deflators.
2. **Cross-Programme Divergence:** Disciplinary differences in tuition growth (Computer Science, Business Administration, Software Engineering, Social Sciences).
3. **Macroeconomic Volatility:** The impact of currency devaluation and inflation spikes (1994–96, 2008–10, 2022–24).
4. **Educational Philanthropy:** The role of **Zakat**, Islamic **Waqf**, **Church Education Trusts**, and **Temple Trusts** in funding higher education in Karachi.
5. **AI Data Analyst:** Google Gemini 3.5 Flash-Lite integration querying database records for academic synthesis.

---

## 📂 Architecture

```text
forty-years-of-fees/
│
├── frontend/                  # Public Research Website (Port 5173)
│   ├── React 19, Vite 6, Tailwind CSS v4, Recharts, Lucide React
│   └── 9 Core Pages: Home, Fees, Comparison, Inflation, AI Insights,
│       Funding, Methodology, Sources, About
│
├── admin/                     # Institutional Admin Portal (Port 5174)
│   ├── React 19, Vite 6, Tailwind CSS v4, Recharts, Lucide React
│   └── Modules: Dashboard, Programmes, Fees, CPI, CSV Import/Export,
│       Sources, Research, AI Assistant, Sites, Users, Audit Logs, Settings
│
├── backend/                   # RESTful API Server (Port 5000)
│   ├── Node.js, Express 5, MongoDB / Mongoose, JWT, Helmet, Rate Limiter
│   ├── Econometric Calculation Engine (Real fees, CAGR, Inflation)
│   └── Google Gemini 3.5 Flash-Lite SDK Integration
│
├── docs/                      # Technical Documentation
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── METHODOLOGY.md
│   ├── SYNTHETIC-DATA.md
│   └── DEPLOYMENT.md
│
├── README.md
└── package.json
```

---

## 🚀 Quick Start Instructions

### 1. Prerequisites
- Node.js >= 18
- MongoDB Atlas or local MongoDB
- Google Gemini API Key

### 2. Configure Environment

Create `backend/.env` (or use the configured Atlas cluster):
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
JWT_SECRET=your_secure_jwt_secret
```

### 3. Seed Database (Generates 410 Annual Tuition Records & 41-Year CPI)

```bash
npm run seed
```

### 4. Run Applications

```bash
# Terminal 1: Backend Server (Port 5000)
npm run dev:backend

# Terminal 2: Public Research Frontend (Port 5173)
npm run dev:frontend

# Terminal 3: Administration Panel (Port 5174)
npm run dev:admin
```

---

## 🔐 Default Administrator Account

- **Email:** `qetmeer.dev@gmail.com`
- **Password:** `Admin123!40Years`
- **Role:** `SUPER_ADMIN`

---

## 🧪 Testing

Run backend financial and econometric unit tests:
```bash
npm test
```

---

## 📜 Research Disclaimer

All generated historical fees are explicitly identified as **Simulated Data / Illustrative Historical Estimates** and do not represent binding historical accounting accounts of Greenwich University.

---

© 1987–2027 Greenwich University, Karachi. Journey 40 Research Platform.
