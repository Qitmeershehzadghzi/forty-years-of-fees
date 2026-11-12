# Research & Econometric Methodology

## Forty Years of Fees — Greenwich University Journey 40

This document defines the mathematical formulation, statistical deflator mechanics, and archival replacement rules utilized throughout the project.

---

## 1. Primary Deflator Formula

To convert nominal historical Pakistani Rupee fees into constant purchasing-power equivalents for any chosen base year $B$:

$$\text{Real Fee}_B = \text{Nominal Fee}_t \times \left( \frac{\text{CPI}_B}{\text{CPI}_t} \right)$$

Where:
- $\text{Nominal Fee}_t$ is the fee charged in calendar year $t$.
- $\text{CPI}_t$ is the Consumer Price Index in year $t$.
- $\text{CPI}_B$ is the Consumer Price Index in target base year $B$ (e.g. 2016 = 100.0 or 2026 = 370.64).

---

## 2. Compound Annual Growth Rate (CAGR)

To smooth annual fluctuations and evaluate multi-decade academic trends:

$$\text{CAGR} = \left[ \left( \frac{\text{Fee}_{t_n}}{\text{Fee}_{t_0}} \right)^{\frac{1}{n}} - 1 \right] \times 100$$

Where $n = t_n - t_0$ is the number of calendar years elapsed.

---

## 3. Annual Inflation Rate

Year-over-year CPI volatility is calculated as:

$$\text{Inflation Rate}_t = \left( \frac{\text{CPI}_t - \text{CPI}_{t-1}}{\text{CPI}_{t-1}} \right) \times 100$$

---

## 4. Verification Workflow

```text
[Archival Discovery]
         │
         ▼
[Admin CSV or Form Upload] ──► Tagged as PENDING_REVIEW
         │
         ▼
[Evidence Attachment] ───────► Physical Gazette Page / Prospectus Scan
         │
         ▼
[Admin Approval] ────────────► Reclassifies to VERIFIED
         │
         ▼
[Supersedes Simulation] ─────► Immediate In-Place Chart & API Update
```
