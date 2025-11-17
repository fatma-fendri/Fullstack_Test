from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import asyncio
import json
import random
from datetime import datetime
from typing import List, Dict
from pydantic import BaseModel
import uuid

app = FastAPI(title="Fullstack Dev Test API")

# CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Data models
class Asset(BaseModel):
    id: str
    name: str
    type: str  # "glb" or "gltf"
    last_modified: str


# In-memory storage (in production, this would be a database)
assets: Dict[str, Asset] = {}
websocket_connections: List[WebSocket] = []

# Asset names pool for randomization
ASSET_NAMES = [
    "Character_Mesh",
    "Building_Structure",
    "Vehicle_Model",
    "Environment_Asset",
    "Prop_Item",
    "Weapon_3D",
    "Furniture_Piece",
    "Tree_Model",
    "Rock_Formation",
    "Architecture_Element",
    "Decorative_Object",
    "Animated_Character",
    "Static_Mesh",
]

ASSET_TYPES = ["glb", "gltf"]


def generate_random_asset() -> Asset:
    """Generate a random asset with random values."""
    asset_id = str(uuid.uuid4())
    return Asset(
        id=asset_id,
        name=random.choice(ASSET_NAMES),
        type=random.choice(ASSET_TYPES),
        last_modified=datetime.now().isoformat(),
    )


def initialize_assets(count: int = 10):
    """Initialize the asset storage with random assets."""
    global assets
    assets = {
        asset.id: asset for asset in [generate_random_asset() for _ in range(count)]
    }


def update_random_assets():
    """Update random assets with new values."""
    if not assets:
        return

    # Update 1-3 random assets each cycle
    num_updates = random.randint(1, min(3, len(assets)))
    selected_assets = random.sample(list(assets.keys()), num_updates)

    for asset_id in selected_assets:
        assets[asset_id].name = random.choice(ASSET_NAMES)
        assets[asset_id].type = random.choice(ASSET_TYPES)
        assets[asset_id].last_modified = datetime.now().isoformat()


async def asset_update_loop():
    """Background task that updates assets every 10 seconds."""
    while True:
        await asyncio.sleep(10)
        update_random_assets()

        # Broadcast update to all WebSocket connections
        if websocket_connections:
            message = {
                "type": "update",
                "data": [asset.dict() for asset in assets.values()],
            }
            disconnected = []
            for connection in websocket_connections:
                try:
                    await connection.send_json(message)
                except:
                    disconnected.append(connection)

            # Remove disconnected connections
            for conn in disconnected:
                if conn in websocket_connections:
                    websocket_connections.remove(conn)


@app.on_event("startup")
async def startup_event():
    """Initialize assets and start the update loop."""
    initialize_assets(10)
    asyncio.create_task(asset_update_loop())


@app.get("/")
async def root():
    return {
        "message": "Fullstack Dev Test API",
        "endpoints": {
            "GET /api/assets": "Get all assets",
            "GET /api/assets/{id}": "Get specific asset",
            "GET /api/assets/stream": "Server-Sent Events stream",
            "WS /ws": "WebSocket connection for real-time updates",
        },
    }


@app.get("/api/assets", response_model=List[Asset])
async def get_assets():
    """Get all assets."""
    return list(assets.values())

@app.get("/api/assets/stream")
async def stream_assets():
    """Server-Sent Events endpoint for real-time asset updates."""

    async def event_generator():
        # Send initial data
        initial_data = json.dumps([asset.dict() for asset in assets.values()])
        yield f"data: {initial_data}\n\n"

        # Keep connection alive and send updates
        while True:
            await asyncio.sleep(10)
            update_random_assets()
            data = json.dumps([asset.dict() for asset in assets.values()])
            yield f"data: {data}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/api/assets/{asset_id}", response_model=Asset)
async def get_asset(asset_id: str):
    """Get a specific asset by ID."""
    if asset_id not in assets:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Asset not found")
    return assets[asset_id]


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time bidirectional communication."""
    await websocket.accept()
    websocket_connections.append(websocket)

    # Send initial data
    initial_message = {
        "type": "initial",
        "data": [asset.dict() for asset in assets.values()],
    }
    await websocket.send_json(initial_message)

    try:
        # Keep connection alive and listen for client messages
        while True:
            # Wait for any message from client (ping/pong or other)
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=1.0)
                # Echo back or handle client message
                await websocket.send_json({"type": "pong", "message": "received"})
            except asyncio.TimeoutError:
                # Timeout is expected, just continue
                pass
    except WebSocketDisconnect:
        if websocket in websocket_connections:
            websocket_connections.remove(websocket)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)