from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.user import UserCreate, UserUpdate, UserInDB
from app.services.user_service import UserService
from app.services.auth import get_current_user

router = APIRouter()
user_service = UserService()

@router.post("/", response_model=UserInDB)
async def create_user(user: UserCreate):
    return await user_service.create_user(user)

@router.get("/me", response_model=UserInDB)
async def read_current_user(current_user = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserInDB)
async def update_user(
    user_update: UserUpdate,
    current_user = Depends(get_current_user)
):
    return await user_service.update_user(current_user.id, user_update)

@router.get("/{user_id}", response_model=UserInDB)
async def read_user(
    user_id: str,
    current_user = Depends(get_current_user)
):
    user = await user_service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return user
