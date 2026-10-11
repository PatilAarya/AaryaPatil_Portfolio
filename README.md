# Portfolio — MERN

An editorial-style portfolio: MongoDB, Express, React (Vite), Node.

## Run it

```bash
npm run setup     # installs root, server and client
npm run dev       # API on :5000, site on http://localhost:5173
```

## Edit your content

Everything lives in **`content/content.js`**. Search it for `TODO`.

- Résumé → `client/public/resume.pdf`
- Project screenshot → `client/public/projects/<name>.webp`, then set `image: '/projects/<name>.webp'`

## Database (optional locally, needed in production)

Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` (MongoDB Atlas free tier works).
Without it, the guestbook and letters are kept in memory and reset on restart.

Read letters people send you:

```bash
curl -H "x-admin-token: YOUR_TOKEN" http://localhost:5000/api/messages
```

Remove a guestbook note: `DELETE /api/guestbook/:id` with the same header.

## Deploy (one service, e.g. Render)

- Build command: `npm run build`
- Start command: `npm start`
- Environment: `MONGODB_URI`, `ADMIN_TOKEN`

Express serves the built site from `client/dist` and the API from `/api`.
