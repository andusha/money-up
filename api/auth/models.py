from sqlmodel import Field, Relationship, SQLModel
from typing import TYPE_CHECKING, Optional

#if TYPE_CHECKING:
 #   from api.team.models import Team


class UserBase(SQLModel):
    email: str = Field(index=True)
    password: str
    is_admin: bool | None = Field(default=False)



class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
