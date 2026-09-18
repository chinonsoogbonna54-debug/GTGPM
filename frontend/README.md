# GTGPM Frontend

React + Vite + Tailwind frontend for the Glory To God Power Ministries
International church feed, built against your FastAPI backend.

## Setup

```powershell
cd frontend
npm install
copy .env.example .env
```

Open `.env` and confirm `VITE_API_URL` points at your running backend
(defaults to `http://127.0.0.1:8000`, which matches `uvicorn main:app --reload`).

## Run

Make sure your FastAPI backend is running first (`uvicorn main:app --reload`
in the backend folder), then in a separate terminal:

```powershell
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

## A few things to know

- **CORS**: your backend will need to allow requests from `http://localhost:5173`.
  If you see network errors in the browser console mentioning CORS, that's
  the fix needed — we'll add it to `main.py` when we connect everything.
- **Cookies for anonymous likes**: the browser needs to accept the
  `user_cookie_id` cookie your `/posts/{id}/like` endpoint sets. This works
  automatically on `localhost` during development.
- **Admin dashboard visibility**: `GET /posts` only returns published posts,
  so a scheduled (not-yet-published) post won't show in the dashboard feed
  until it goes live. A future improvement would be a dedicated admin
  listing endpoint that includes drafts/scheduled posts.
- **Editing photos/video**: the backend's edit endpoint only updates text
  fields (title, pinned, event/sermon/announcement text) — it doesn't
  support swapping photos or a video on an existing post, so the edit form
  reflects that. To change media, delete and recreate the post.

## Folder structure

```
src/
  api/client.js       — every backend call in one place
  context/             — AuthContext (admin login state)
  components/          — shared UI: Navbar, PostCard, EventCarousel, etc.
  pages/                — one file per route
```
