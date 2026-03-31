# Note App

A full-stack notes application built to polish backend, frontend, and deployment skills. It uses a Django REST API for authentication and note management, with a React + Vite frontend for the user interface.

Live demo: https://django-noteapp-frontend.onrender.com

## Features

- User registration and login
- JWT-based authentication with access/refresh tokens
- Protected frontend routes
- Create, list, and delete personal notes
- Django REST API with per-user note isolation
- Render-friendly backend setup with `gunicorn`, `whitenoise`, and `dj-database-url`

## Tech Stack

- Frontend: React 19, Vite, React Router, Axios
- Backend: Django 6, Django REST Framework, Simple JWT
- Database: PostgreSQL in production via `DATABASE_URL`
- Deployment tooling: WhiteNoise, Gunicorn, Render build script

## Project Structure

```text
noteapp/
|-- backend/     # Django project and REST API
|-- frontend/    # React + Vite client
|-- README.md
```

## How It Works

- Users register through `POST /api/user/register/`
- Users log in through `POST /api/token/` and receive JWT tokens
- The frontend stores tokens in `localStorage`
- Protected requests include the access token in the `Authorization` header
- When an access token expires, the frontend tries to refresh it through `POST /api/token/refresh/`
- Authenticated users can manage only their own notes

## Environment Variables

Create local `.env` files for the backend and frontend. Do not commit real secrets.

### Backend: `backend/.env`

```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:5432/DB_NAME
```

Optional legacy variables are also present in the codebase comments, but `DATABASE_URL` is the one currently used.

### Frontend: `frontend/.env`

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Local Development Setup

### 1. Backend setup

From the `backend` directory:

```powershell
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend will run at `http://127.0.0.1:8000`.

### 2. Frontend setup

From the `frontend` directory:

```powershell
npm install
npm run dev
```

The frontend will run on Vite's local dev server, typically `http://localhost:5173`.

## API Endpoints

### Authentication

- `POST /api/user/register/` - create a new user
- `POST /api/token/` - obtain access and refresh tokens
- `POST /api/token/refresh/` - refresh the access token

### Notes

- `GET /api/notes/` - list the authenticated user's notes
- `POST /api/notes/` - create a note
- `DELETE /api/notes/delete/<id>/` - delete a note owned by the authenticated user

## Data Model

Each note includes:

- `id`
- `title`
- `content`
- `created_at`
- `author`

## Production Notes

- Backend static files are served with WhiteNoise
- The backend includes a Render-style `build.sh` that installs dependencies, runs `collectstatic`, and applies migrations
- CORS is currently configured for localhost Vite ports and a Render frontend URL
- `ALLOWED_HOSTS` includes localhost and a Render backend domain

## Useful Commands

### Backend

```powershell
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py test
```

### Frontend

```powershell
npm run dev
npm run build
npm run preview
npm run lint
```

## Important Security Note

The current repo contains populated `.env` files. Those should be treated as compromised if they were committed or shared publicly. Rotate real credentials and replace committed secrets with local-only environment files or a secrets manager before deploying further.
