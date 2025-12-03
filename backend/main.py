from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from database import SessionLocal, engine, Base, User

# create DB tables if not present
Base.metadata.create_all(bind=engine)

app = FastAPI(title="OJT Simple Auth & CRUD API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models (schemas)
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    class Config:
        orm_mode = True

@app.post("/register", response_model=dict, tags=["Auth"])
def register(payload: UserCreate, db: Session = Depends(get_db)):
    # simple unique email check
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = bcrypt.hash(payload.password)
    user = User(name=payload.name, email=payload.email, password=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Registered", "user_id": user.id}

@app.post("/login", response_model=dict, tags=["Auth"])
def login(payload: UserCreate, db: Session = Depends(get_db)):
    # Note: Login here uses email + password; in a real app use tokens.
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not bcrypt.verify(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user_id": user.id}

@app.get("/users", response_model=list[UserOut], tags=["Users"])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.get("/users/{user_id}", response_model=UserOut, tags=["Users"])
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{user_id}", response_model=dict, tags=["Users"])
def update_user(user_id: int, payload: UserCreate, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.name = payload.name
    user.email = payload.email
    user.password = bcrypt.hash(payload.password)
    db.add(user)
    db.commit()
    return {"message": "Updated"}

@app.delete("/users/{user_id}", response_model=dict, tags=["Users"])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "Deleted"}
