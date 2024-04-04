from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from api.auth.manager import manager
from api.auth.models import User
from api.balance.models import Balance
from api.dependencies import get_session
from .models import Category, CategoryCreate, CategoryRead, CategoryUpdate

router = APIRouter()


@router.post("/categories/", response_model=CategoryRead)
def create_category(
    *,
    session: Session = Depends(get_session),
    user: User = Depends(manager),
    category: CategoryCreate,
):
    db_category = category.model_dump()
    db_category["user_id"] = user.id
    db_category = Category.model_validate(db_category)
    session.add(db_category)
    session.commit()
    session.refresh(db_category)

    return db_category


@router.get("/categories/", response_model=list[CategoryRead])
def read_category(
    *,
    session: Session = Depends(get_session),
    user: User = Depends(manager),
):

    categories = session.exec(
        select(Category).where(
            Category.user_id == user.id,
        )
    ).all()

    return categories


@router.patch("/categories/{category_id}", response_model=CategoryRead)
def update_category(
    *,
    session: Session = Depends(get_session),
    user: User = Depends(manager),
    category_id: str,
    category: CategoryUpdate,
):
    db_category = session.exec(
        select(Category).where(
            Category.id == category_id,
            Category.user_id == user.id,
        )
    ).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="category not found")
    
    category_data = category.model_dump(exclude_unset=True)
    for key, value in category_data.items():
        setattr(db_category, key, value)
    session.add(db_category)
    session.commit()
    session.refresh(db_category)

    return db_category


@router.delete("/categories/{category_id}")
def delete_category(
    *,
    session: Session = Depends(get_session),
    user: User = Depends(manager),
    category_id: str,
):
    category = session.exec(
        select(Category).where(
            Category.id == category_id,
            Category.user_id == user.id,
        )
    ).first()

    linked_balance = session.exec(
        select(Balance).where(Balance.category_id == category_id)
    ).first()

    print(linked_balance)
    if linked_balance:
        raise HTTPException(status_code=409, detail="category linked with balance")
    if not category:
        raise HTTPException(status_code=404, detail="category not found")

    session.delete(category)
    session.commit()

    return {"ok": True}
