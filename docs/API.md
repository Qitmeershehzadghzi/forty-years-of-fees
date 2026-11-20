# RESTful API Reference — Forty Years of Fees

All endpoints are prefixed with `/api`.

---

## 1. Authentication
- `POST /api/auth/login` — Authenticate admin or researcher. Body: `{ email, password }`.
- `POST /api/auth/logout` — Revoke token / session.
- `GET  /api/auth/me` — Return current authenticated profile.

---

## 2. Academic Programmes
- `GET    /api/programmes` — List active programmes.
- `GET    /api/programmes/:id` — Details of specific programme.
- `POST   /api/programmes` — Create programme *(Admin only)*.
- `PUT    /api/programmes/:id` — Update programme *(Admin only)*.
- `DELETE /api/programmes/:id` — Delete or soft-deactivate programme *(Admin only)*.

---

## 3. Historical Fees
- `GET    /api/fees` — Query fees with filters: `programmeId`, `siteId`, `feeType`, `dataType`, `startYear`, `endYear`, `page`, `limit`.
- `GET    /api/fees/history/:programmeId` — Retrieve 41-year historical trajectory.
- `GET    /api/fees/export` — Stream filtered CSV dataset.
- `POST   /api/fees` — Insert fee record *(Admin only)*.
- `PUT    /api/fees/:id` — Update fee amount, verification status *(Admin only)*.
- `DELETE /api/fees/:id` — Remove fee entry *(Admin only)*.
- `POST   /api/fees/import` — Multipart CSV or raw text batch upload *(Admin only)*.

---

## 4. Macroeconomic Inflation (PBS CPI)
- `GET    /api/inflation` — Retrieve CPI series (1987–2027).
- `POST   /api/inflation` — Insert CPI index point *(Admin only)*.
- `PUT    /api/inflation/:id` — Update CPI reading *(Admin only)*.
- `DELETE /api/inflation/:id` — Remove CPI reading *(Admin only)*.
- `POST   /api/inflation/import` — Batch upload CPI CSV *(Admin only)*.

---

## 5. Analytics & Econometric Engine
- `GET /api/analytics/overview` — High-level statistics: total records, verified count, simulated ratio, coverage.
- `GET /api/analytics/nominal-fees` — Multi-programme yearly line chart series.
- `GET /api/analytics/real-fees` — Deflated purchasing-power series vs nominal fee for a given base year.
- `GET /api/analytics/programme-comparison` — Compare up to 5 programmes across CAGR and nominal/real lines.
- `GET /api/analytics/inflation-trends` — Annual inflation volatility (%) and CPI progression.
- `GET /api/analytics/fee-growth` — Cumulative and CAGR ranking across all faculties.
- `GET /api/analytics/data-quality` — Missing years, audit coverage, and verification breakdown.

---

## 6. Google Gemini AI Research Assistant
- `POST /api/ai/chat` — Contextual academic Q&A grounded on real MongoDB records.
- `POST /api/ai/analyze-programme` — Structured JSON faculty analysis (findings, trends, limitations, conclusions).
- `POST /api/ai/compare-programmes` — Comparative multi-programme evaluation.
- `POST /api/ai/generate-report` — Journey 40 Executive Monograph synthesis.

---

## 7. Educational Philanthropy Research
- `GET    /api/research` — List published monographs (Zakat, Waqf, Church Trusts, Temple Trusts).
- `GET    /api/research/:id` — Read single monograph with citations.
- `POST   /api/research` — Create monograph *(Researcher+)*.
- `PUT    /api/research/:id` — Update monograph *(Researcher+)*.
- `DELETE /api/research/:id` — Delete monograph *(Admin only)*.

---

## 8. Campus Sites & Audit Trail
- `GET  /api/sites` — List campus facilities (Clifton Block 1, etc.).
- `GET  /api/audit` — Immutable log trail of all data modifications *(Admin only)*.
