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
    from api.schemas import BlockCreate, TamperRequest, RollbackRequest
except ModuleNotFoundError:
    from schemas import BlockCreate, TamperRequest, RollbackRequest

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


# ── Incident Response Endpoints ──────────────────────────────

@app.get("/audit")
def audit_chain():
    """Forensic scan — identify exactly which blocks are compromised and why."""
    return blockchain.audit_chain()


@app.post("/rollback")
def rollback(payload: RollbackRequest):
    """Rollback to a known-good checkpoint, discarding compromised blocks."""
    result = blockchain.rollback_to(payload.index)

    if result is None:
        raise HTTPException(status_code=400, detail="Invalid rollback index")

    return result


@app.post("/repair")
def repair():
    """Re-mine compromised blocks to restore chain integrity."""
    return blockchain.repair_chain()