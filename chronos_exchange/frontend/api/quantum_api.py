from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import asyncio
import json
from datetime import datetime
import sys
sys.path.append('.')
from quantum_blockchain.core.quantum_chain import quantum_blockchain
from ai_evolution.engine.predictor import quantum_predictor
from chronos_exchange.ai_market_maker.odds_calculator import odds_calculator

app = FastAPI(title="Цифра + Chronos Quantum API", version="1.0.0")

class EventRequest(BaseModel):
    event_id: str
    event: str
    category: str
    probability: int = 85
    style: str = "quantum_cyberpunk"
    end_time: float

class BlockResponse(BaseModel):
    index: int
    digit: int
    timestamp: float
    hash: str
    previous_hash: str
    nonce: int
    ai_score: float
    prediction_outcome: Optional[bool]
    data: Dict

@app.get("/")
async def root():
    return {"message": "🌌 Цифра + Chronos Quantum Blockchain API", "status": "active"}

@app.get("/blocks")
async def get_blocks():
    blocks = [block.to_dict() for block in quantum_blockchain.chain]
    return {"blocks": blocks, "total_blocks": len(blocks)}

@app.get("/block/{index}")
async def get_block(index: int):
    if index < 0 or index >= len(quantum_blockchain.chain):
        raise HTTPException(status_code=404, detail="Block not found")
    return quantum_blockchain.chain[index].to_dict()

@app.get("/stats")
async def get_stats():
    digital_distribution = {str(i): 0 for i in range(10)}
    for block in quantum_blockchain.chain:
        digital_distribution[str(block.digit)] += 1
    return {
        "total_blocks": len(quantum_blockchain.chain),
        "digital_distribution": digital_distribution,
        "avg_ai_score": quantum_predictor.accuracy,
        "cell_network_size": quantum_blockchain.cell_network_size,
        "evolution_cycle": quantum_blockchain.evolution_cycle,
        "listed_nfts": len(quantum_blockchain.chain) - 1,
        "active_markets": len(quantum_blockchain.prediction_markets)
    }

@app.post("/add-event")
async def add_event(event_request: EventRequest):
    try:
        quantum_blockchain.create_prediction_market(
            event_request.event_id,
            event_request.event,
            event_request.end_time
        )
        return {
            "status": "success",
            "message": "Событие добавлено в очередь майнинга",
            "event_id": event_request.event_id,
            "event": event_request.event,
            "probability": event_request.probability
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/odds/{event_id}")
async def get_odds(event_id: str):
    try:
        market = quantum_blockchain.prediction_markets.get(event_id)
        if not market:
            raise HTTPException(status_code=404, detail="Market not found")
        odds = await odds_calculator.calculate_odds({
            "event_id": event_id,
            "description": market["description"],
            "category": "general",
            "digit": quantum_blockchain.chain[-1].digit
        })
        return odds
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/markets")
async def get_markets():
    markets = [
        {"event_id": event_id, "description": data["description"], "end_time": data["end_time"]}
        for event_id, data in quantum_blockchain.prediction_markets.items()
    ]
    return {"markets": markets}

@app.get("/validate")
async def validate_chain():
    is_valid = quantum_blockchain.is_chain_valid()
    return {"valid": is_valid, "message": "Chain is valid" if is_valid else "Chain is invalid"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
