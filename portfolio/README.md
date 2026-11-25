# Kashish Mahore: full-stack portfolio

React (Vite) client, Express API, PostgreSQL. Projects and messages live in the database; an admin page at `/#admin` lets you add or delete projects and read messages.

## Run locally
1. Create a database, then load it: `psql "$DATABASE_URL" -f server/schema.sql`
2. `cd server && cp .env.example .env` (fill in values) `&& npm install && npm run dev`
3. `cd client && cp .env.example .env && npm install && npm run dev` then open http://localhost:5173

## Deploy
- Database: Neon (free). Run `schema.sql` in its SQL editor. Use the connection string with `PGSSL=1`.
- API: Render or Railway. Root `server`, start command `npm start`. Set the variables from `.env.example`, with `CLIENT_URL` as your site URL.
- Client: Vercel. Root `client`, set `VITE_API` to your API URL.

## Before you publish
Edit the project links in `schema.sql` (or in the admin page) to your real repos and live demos, and set a strong `ADMIN_PASSWORD` and `JWT_SECRET`.
