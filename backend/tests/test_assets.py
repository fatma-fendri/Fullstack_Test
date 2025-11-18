import pytest
from httpx import AsyncClient, ASGITransport
from backend.main import app

@pytest.mark.asyncio
async def test_get_assets():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/assets")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

@pytest.mark.asyncio
async def test_create_asset():
    transport = ASGITransport(app=app)
    new_asset = {
        "id": "test-123",
        "name": "TestAsset",
        "type": "glb",
        "last_modified": "2025-11-19T00:00:00"
    }
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/assets", json=new_asset)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "test-123"

@pytest.mark.asyncio
async def test_get_asset_by_id():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/assets/test-123")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "TestAsset"

@pytest.mark.asyncio
async def test_update_asset():
    transport = ASGITransport(app=app)
    updated_asset = {
        "id": "test-123",
        "name": "UpdatedAsset",
        "type": "gltf",
        "last_modified": "2025-11-19T00:10:00"
    }
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.put("/api/assets/test-123", json=updated_asset)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "UpdatedAsset"

@pytest.mark.asyncio
async def test_delete_asset():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.delete("/api/assets/test-123")
    assert response.status_code == 200
    data = response.json()
    assert "deleted successfully" in data["message"]
