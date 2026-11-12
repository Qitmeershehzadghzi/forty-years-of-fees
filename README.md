# Forty Years of Fees

Three applications:

- frontend/: public research website, http://localhost:5173
- admin/: private fee workbook and research desk, http://localhost:5174/admin/
- backend/: API, authentication, MongoDB and AI, port 5000

Run npm install then npm run dev inside each folder in separate terminals. Start local MongoDB first. Credentials and AI keys belong only in backend/.env.

Production: run npm run build in frontend and admin; run backend with NODE_ENV=production and APP_ORIGIN configured. Backend serves the public site at / and the admin application at /admin/.
