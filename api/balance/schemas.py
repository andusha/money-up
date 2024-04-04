from pydantic import BaseModel

class SortByOperation(BaseModel):
    income: int | None = None
    expense: int | None = None