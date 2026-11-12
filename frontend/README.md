# Forty Years of Fees — frontend

## Run
Open a terminal inside frontend and run npm run dev. Open http://localhost:5173. Start the backend separately with npm run dev from backend.

## Use
1. Create the first local researcher account or sign in.
2. Add the documented programme name.
3. Select a year and enter fee amount, unit, component and source.
4. Check the verification box only after reading the original evidence; otherwise save as draft.
5. Save. The graph and calculation summary update automatically. Continue with another year/programme.
6. Use Price indices to add sourced annual PBS CPI levels. Missing CPI is explicitly reported.
7. Select programme, reference year and comparison filters to compare like with like.
8. When AI is configured, automatic explanation after saving is optional. It uses selected research figures and citations; a failure does not lose the saved fee.
9. Graphs & findings provides CSV, JSON fact-sheet export and browser Print/Save as PDF, including sourced charity notes.

Do not substitute annual inflation percentages for CPI index levels. A complete calendar-year 2026 mean is unavailable during 2026. Broad degree categories are not automatically individual programme histories.

## Source folders
pages: complete screens; components: reusable forms, charts and login; context: authentication; hooks: browser navigation; services: API and export functions; utils: formatting/CSV; styles: responsive layouts.

npm run build creates dist. npm run preview serves the built frontend. The backend serves dist in production. The Public archive and Advanced research desk remain available from the workspace sidebar.
