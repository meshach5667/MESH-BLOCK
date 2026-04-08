from pydantic import BaseModel


class BlockCreate(BaseModel):
    data: str


class TamperRequest(BaseModel):
    index: int
    new_data: str