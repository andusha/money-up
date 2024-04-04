from sqlmodel import Field, Relationship, SQLModel
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from api.balance.models import Balance


class CategoryBase(SQLModel):
    id: str = Field(primary_key=True)
    name: str = Field()
    operation: str = Field()


class Category(CategoryBase, table=True):
    balance: Optional["Balance"] = Relationship(back_populates="category")

    user_id: int = Field(foreign_key="user.id")


class CategoryCreate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    pass


class CategoryUpdate(SQLModel):
    name: str | None = None

