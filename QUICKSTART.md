# Quick Start Guide

## Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

## Quick Setup (5 minutes)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend runs on: `http://localhost:8000`

### 2. Frontend Setup (New Terminal)

```bash
cd frontend
npm install
npm run generate:routes  # Generate TanStack Router route tree
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Verify It's Working

1. Open `http://localhost:5173` in your browser
2. You should see a table with 10 assets
3. Wait 10 seconds - assets should update automatically
4. Toggle between WebSocket and SSE buttons
5. Watch the connection status indicator

## API Test

You can test the API directly:

```bash
# Get all assets
curl http://localhost:8000/api/assets

# Get API info
curl http://localhost:8000/
```

## Troubleshooting

**Backend won't start?**
- Check Python version: `python --version` (needs 3.8+)
- Make sure port 8000 is free
- Try: `pip install --upgrade -r requirements.txt`

**Frontend won't start?**
- Make sure backend is running first
- Try: `rm -rf node_modules && npm install`
- Generate routes: `npm run generate:routes`

**No real-time updates?**
- Check browser console for errors
- Verify backend is running
- Check network tab for WebSocket/SSE connections
