from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import sys
from pathlib import Path

try:
    from blockchain import Blockchain
except ModuleNotFoundError:
    sys.path.append(str(Path(__file__).resolve().parents[1]))
    from blockchain import Blockchain

try:
    from api.schemas import BlockCreate, TamperRequest
except ModuleNotFoundError:
    from schemas import BlockCreate, TamperRequest

app = FastAPI(title="Blockchain Simulator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

blockchain = Blockchain(difficulty=3)


@app.get("/")
def home():
    return {"message": "Blockchain API is running"}


@app.get("/blocks")
def get_blocks():
    return {"chain": blockchain.get_chain()}


@app.post("/blocks")
def add_block(payload: BlockCreate):
    if not payload.data.strip():
        raise HTTPException(status_code=400, detail="Block data cannot be empty")

    block = blockchain.add_block(payload.data)
    return {
        "message": "Block added successfully",
        "block": block.to_dict()
    }


@app.get("/validate")
def validate_chain():
    return {"is_valid": blockchain.is_chain_valid()}


@app.get("/stats")
def stats():
    return blockchain.get_stats()


@app.post("/tamper")
def tamper(payload: TamperRequest):
    block = blockchain.tamper_block(payload.index, payload.new_data)

    if block is None:
        raise HTTPException(status_code=400, detail="Invalid block index")

    return {
        "message": f"Block {payload.index} tampered successfully",
        "block": block.to_dict()
    }