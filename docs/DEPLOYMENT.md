# Deployment & Production Setup

## Forty Years of Fees — Greenwich University Journey 40

This guide provides steps for running all three applications locally in development or deploying to production environments.

---

## 1. Prerequisites
- Node.js >= 18 (Recommended: v20 LTS or v22)
- MongoDB Atlas cluster or local MongoDB instance >= 6.0
- Google Gemini API key

---

## 2. Installation & Quick Start

```bash
# 1. Clone repository
git clone <repo-url>
cd forty-years-of-fees

# 2. Configure Backend Environment
# Edit backend/.env with your MONGODB_URI and GEMINI_API_KEY

# 3. Seed Database (Generates 400 annual tuition records & 40-year CPI)
npm run seed

# 4. Start all three applications in separate terminals:
# Terminal 1: Backend API (Port 5000)
npm run dev:backend

# Terminal 2: Public Research Frontend (Port 5173)
npm run dev:frontend

# Terminal 3: Institutional Admin Portal (Port 5174)
npm run dev:admin
```

---

## 3. Production Build

```bash
# Build Frontend
npm run build:frontend

# Build Admin Panel
npm run build:admin
```

The compiled assets will be available in `frontend/dist` and `admin/dist`.
The backend can serve them as static directories or they can be deployed to CDN hosting (Vercel, Netlify, Firebase Hosting).
