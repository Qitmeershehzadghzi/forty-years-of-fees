# Forty Years of Fees — backend

## Start locally
1. Open a terminal inside backend.
2. Run npm install if dependencies are missing.
3. Run npm run dev.
4. Start the frontend in another terminal. Open http://localhost:5173 and create your first researcher account.

MongoDB local URL: mongodb://127.0.0.1:27017/forty_years_of_fees
The MongoDB Windows service must be running. Existing records are not deleted or migrated automatically.

## Folders
- config: environment, MongoDB connection, initial PBS references, admin and migration commands
- middleware: authentication, origin-related request handling, validation and errors
- controllers: endpoint logic, exact calculations, AI explanations and their tests
- routes: endpoint definitions
- models: MongoDB schemas, mutation lock and saved AI reports
- server.js: server entry point (keeps your root-file change)
- app.js: Express configuration

## Main workflow API
- GET /api/workspace/status: setup and AI configuration status
- POST /api/workspace/setup: first local account only
- GET /api/workspace/data: all research records, including drafts; authenticated
- POST /api/workspace/programmes: add a named programme
- PUT /api/workspace/fees: save/edit one programme/year/term fee with source
- POST /api/workspace/cpi: add an annual price-index level with source
- GET /api/workspace/report: exact scoped calculations, graph points, gaps and citations
- POST /api/workspace/explain: AI interpretation of the computed report
Existing research-desk routes continue to work.

## Data and accuracy
Programmes, fee records, sources, CPI records, research notes, users, sessions, audit logs and AI reports use separate MongoDB collections. Quick-save keys make retries idempotent. Document/source and fee writes are validated first and serialized; standalone MongoDB writes are not a multi-document transaction. Retry with the same key after a partial network failure. Missing fee years are never interpolated; duplicate observations are excluded from chart points. Only published fees with verified sources and compatible verified CPI generate real values. Nominal drafts are clearly labelled.

The bundled initial reference contains only 2020 and 2025 calendar means calculated from official PBS National monthly CPI (2015–16 base). All twelve input values and exact PDF pages are stored in the CPI notes. It does not invent a 2026 calendar mean. Earlier years need a sourced compatible CPI series. Changing the CPI base or geography requires a separately documented series.

## AI setup
In .env set OPENAI_API_KEY to your own API key. OPENAI_MODEL defaults to gpt-4.1-mini and can be changed to a supported Responses model available in your API account. Restart the backend. Never put keys in frontend code, uploads, chat messages or source control.

The frontend discloses when selected research figures/citations go to OpenAI. AI is optional for arithmetic: fee storage, calculated summaries, graphs, CSV/JSON export and printing work without a key. Explanations are stored with the exact evidence fingerprint; editing data invalidates old interpretations. AI cannot write fees or CPI. Explanations remain drafts, not source verification. API calls may incur charges on the configured account. API docs: https://developers.openai.com/api/docs/guides/text

## Checks
npm test
npm run test:integration
Integration tests use a separate temporary database with synthetic fixtures; they do not touch your local research database. Tests live beside controllers to keep the requested folder structure compact.

## Production
Build ../frontend, set NODE_ENV=production and APP_ORIGIN to the real HTTPS origin, then npm start. First-account web setup is disabled in production; use npm run admin:create. Back up MongoDB and uploaded documents before deployment. Use npm run migrate:legacy only if deliberately migrating an older dataset.

Year workbook: select an entry year and click a programme to add or edit its scoped fee. Graph explanations run automatically after the matching report loads when AI is enabled. Set GEMINI_API_KEY or OPENAI_API_KEY in .env; Gemini takes priority when both are configured. Empty credentials leave calculations and storage available.

## Curated research import · 6 November 2026
Run npm run research:import to insert the cited dataset in config/greenwich-research.json. Existing keys are preserved; no automatic interpolation or overwrites. Initial import: 78 programme/category rows, 86 fees (81 published, 5 drafts), 12 sources, 6 additional annual CPI observations (2018, 2019, 2021–2024). Together with PBS startup references this covers 2018–2025 CPI. The 2017 secondary archive is per credit hour; 2026 official standard tariff is per course. Current named programmes inherit their degree-level standard tariff with that mapping disclosed. 2020 indexed PDFs now redirect and remain drafts, including the normal MA English five-course tuition. Missing years remain absent.

## Source audit · 8 November 2026
Supersedes the previous import summary: 73 inferred programme fees were removed from the curated input and local database. There are 21 remaining fees: 16 published (four 2017 archive categories, four dated 2026 official categories, eight direct named-pathway tuition/semester-total observations), plus five historical drafts. Named-pathway observations have no stated effective year and cannot be inflation-adjusted. All 82 catalogue/category entries can be browsed; most named degrees have no directly verified fee. Preserved HTML, checksums and the pre-audit backup are in config/evidence. No complete university history is claimed.
