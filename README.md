# PaymentOps Dashboard — Full Production-Feel Demo

Everything runs frontend-only with embedded **DEMO DATA** CSVs.

## Features
- Summary (MTD KPIs, daily volume, method mix, top merchants)
- Transactions (filters, saved views, detail drawer, CSV export w/ DEMO watermark)
- Merchants (MTD metrics, approval)
- Payouts (table + weekly totals chart)
- Chargebacks (SLA countdown + 'Submit Representment' stub that audit-logs)
- Customers (PII masked; Admin-only reveal audit-logged)
- Developer Console (error rate & p95 latency by hour)
- Audit Logs (table + distribution chart)
- Settings (role, tz)

## Quickstart
1. `npm i`
2. `npm run dev`
3. Open http://localhost:5173

Data is under `public/data/` and loads automatically.
