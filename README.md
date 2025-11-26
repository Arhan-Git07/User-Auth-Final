
OJT Simple FastAPI Auth & CRUD
-----------------------------
What this bundle contains:
- Backend (2 python files): db.py (SQLAlchemy models+engine), main.py (FastAPI app, Pydantic models, CRUD)
- Frontend (3 files): index.html, style.css, app.js (simple vanilla JS + separated CSS)
- requirements.txt (packages to install)

Features included (as requested):
- Design Doc referenced (user uploaded OJT Project Design Template) included in project root.
- FastAPI setup with Swagger OpenAPI UI (visit /docs when server running).
- Basic CRUD for user profiles (create/register, read list/get, update, delete).
- Pydantic models used for request validation and response models.

How to run:
1. Create a virtualenv and install requirements: pip install -r requirements.txt
2. Start the API: uvicorn backend.main:app --reload
3. Open frontend/index.html in browser OR serve it (python -m http.server) and open.
4. API docs (Swagger) available at: http://localhost:8000/docs

Notes:
- Database is a lightweight SQLite file (users.db) created in the backend folder.
- Passwords are hashed using passlib's bcrypt (simple demo; for production add more security).
