# User Auth & Profiles

A simple FastAPI backend with JWT authentication, RBAC (Role-Based Access Control), and a vanilla JavaScript frontend.

## Features

- ✅ User Registration & Login with JWT tokens
- ✅ Role-Based Access Control (Admin, Moderator, User)
- ✅ User Profile Management
- ✅ Secure password hashing (bcrypt)
- ✅ RESTful API with Swagger documentation
- ✅ Modern frontend with authentication flow

## Quick Start (Local)

1. **Create virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Run backend**:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```
   Backend runs on: http://localhost:8000

4. **Open frontend**:
   - Open `frontend/index.html` in your browser
   - Or serve it: `python -m http.server 3000` (in frontend folder)

5. **API Documentation**:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## 🚀 Deployment

**See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions!**

### Quick Deploy (Easiest Method):

1. **Backend**: Deploy to [Render.com](https://render.com) (free)
   - Connect GitHub repo
   - Set build command: `pip install -r backend/requirements.txt`
   - Set start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

2. **Frontend**: Deploy to [Netlify](https://netlify.com) (free)
   - Drag & drop `frontend` folder
   - Update `frontend/config.js` with your backend URL
   - Redeploy

3. **Done!** Your app is live and accessible to everyone! 🎉

## Project Structure

```
.
├── backend/
│   ├── main.py           # FastAPI application
│   ├── database.py      # Database models
│   ├── jwt_auth.py      # JWT authentication
│   ├── rbac.py          # Role-Based Access Control
│   ├── requirements.txt # Python dependencies
│   └── users.db         # SQLite database (created automatically)
├── frontend/
│   ├── index.html       # Main HTML file
│   ├── app.js           # Frontend JavaScript
│   ├── style.css        # Styles
│   └── config.js        # API configuration (update for deployment!)
├── DEPLOYMENT.md        # Detailed deployment guide
└── README.md           # This file
```

## Role Permissions

- **Admin** (email contains "admin"): Full access (read, write, delete)
- **Moderator** (email contains "mod"): Can read and write (edit users)
- **User** (default): Read-only access

## API Endpoints

- `POST /register` - Register new user
- `POST /login` - Login and get JWT token
- `GET /users` - List all users (requires auth)
- `GET /users/{id}` - Get user by ID (requires auth)
- `PUT /users/{id}` - Update user (requires write permission)
- `DELETE /users/{id}` - Delete user (requires admin permission)

## Notes

- Database is SQLite (`backend/users.db`) - automatically created
- Passwords are hashed using bcrypt
- JWT tokens expire after 30 minutes
- CORS is enabled for all origins (configure for production)
