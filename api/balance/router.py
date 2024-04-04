from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import load_only
from sqlmodel import Session, col, select

from api.auth.manager import manager
from api.auth.models import User
from api.balance.schemas import SortByOperation
from api.dependencies import get_session

# from api.models import BalanceReadWithTeam

from .models import (
    BalanceCreate,
    BalanceRead,
    Balance,
    BalanceReadWithCategory,
    BalanceUpdate,
)

router = APIRouter()


@router.post("/balance/", response_model=BalanceRead)
def create_balance(
    *,
    session: Session = Depends(get_session),
    user: User = Depends(manager),
    balance: BalanceCreate,
):
    db_balance = balance.model_dump()
    db_balance["user_id"] = user.id
    db_balance = Balance.model_validate(db_balance)
    session.add(db_balance)
    session.commit()
    session.refresh(db_balance)
    return db_balance


@router.get("/balance", response_model=list[BalanceReadWithCategory])
def read_balance(
    *,
    session: Session = Depends(get_session),
    user: User = Depends(manager),
    date: str,
    operation: str,
):
    balance_arr = session.exec(
        select(Balance).where(
            Balance.user_id == user.id,
            Balance.operation == operation,
            col(Balance.date).contains(date),
        )
    ).all()

    return balance_arr


@router.patch("/balance/{balance_id}", response_model=BalanceUpdate)
def update_balance(
    *,
    session: Session = Depends(get_session),
    user: User = Depends(manager),
    balance_id: str,
    balance: BalanceUpdate,
):

    db_balance = session.exec(
        select(Balance).where(
            Balance.user_id == user.id,
            Balance.id == balance_id,
        )
    ).first()
    if not db_balance:
        raise HTTPException(status_code=404, detail="Balance not found")

    balance_data = balance.model_dump(exclude_unset=True)
    for key, value in balance_data.items():
        setattr(db_balance, key, value)
    session.add(db_balance)
    session.commit()
    session.refresh(db_balance)

    return db_balance


@router.delete("/balance/{balance_id}")
def delete_balance(
    *,
    session: Session = Depends(get_session),
    balance_id: str,
    user: User = Depends(manager),
):
    balance = session.exec(
        select(Balance).where(
            Balance.user_id == user.id,
            Balance.id == balance_id,
        )
    ).first()

    if not balance:
        raise HTTPException(status_code=404, detail="Balance not found")

    session.delete(balance)
    session.commit()
    return {"ok": True}


@router.get("/balance/sort", response_model=SortByOperation)
def read_balance_sort(
    *,
    session: Session = Depends(get_session),
    user: User = Depends(manager),
    date: str,
):
    balance_arr = session.exec(
        select(
            Balance.operation,
            func.sum(Balance.sum),
        )
        .filter(
            Balance.user_id == user.id,
            col(Balance.date).contains(date),
        )
        .group_by(Balance.operation)
    ).all()
    print(balance_arr)
    balance_arr_to_json = {}
    for item in balance_arr:
        balance_arr_to_json[item[0]] = item[1]

    return balance_arr_to_json
