from sqlmodel import Field, Relationship, SQLModel
from typing import TYPE_CHECKING, Optional

from api.category.models import Category , CategoryRead

class BalanceBase(SQLModel):
    id: str = Field(primary_key=True)
    sum: int
    operation: str
    date: str = Field(index=True)

    category_id: str = Field(foreign_key="category.id")


class Balance(BalanceBase, table=True):
    category: Optional["Category"] = Relationship(back_populates="balance")

    user_id: int = Field(foreign_key="user.id")


class BalanceRead(BalanceBase):
    pass


class BalanceCreate(BalanceBase):
    pass


class BalanceUpdate(SQLModel):
    date: str | None = None
    operation: str | None = None
    sum: int | None = None
    category_id: str | None = None

class BalanceReadWithCategory(BalanceRead):
    category: "CategoryRead"
