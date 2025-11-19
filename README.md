# Fullstack Developer Test

## Overview

This repository contains my implementation of a fullstack development test.  
The project demonstrates my ability to work with real-time data, modern frontend frameworks, and backend API design.

I started from the functional codebase provided and enhanced it with significant improvements across both frontend and backend. On the frontend, I optimized real‑time hook usage by conditionally activating WebSocket or SSE to reduce resource consumption, added visual feedback for asset updates with row highlighting and animations, improved error handling with clearer messages and exponential backoff, introduced filtering and sorting by type, name, or last modified date, built an asset detail view with live updates using TanStack Router, and implemented a connection quality indicator showing latency, message frequency, and health metrics. On the backend, I added REST endpoints for asset creation, updating, and deletion, enforced validation with Pydantic models, integrated request logging, and developed integration tests to ensure API reliability.

## Project Structure
```
fullstack_dev_task/ 
├── backend/ # Python FastAPI backend 
│   ├── __init__.py
│   ├── main.py
│   ├── requirements.txt  # Backend dependencies
│   └── tests/            # Pytest integration tests
│       └── test_assets.py
├── frontend/ # React + TypeScript frontend 
│ ├── src/ 
│ │ ├── routes/ # TanStack Router routes (index, asset detail) 
│ │ ├── hooks/ # Custom hooks (WebSocket, SSE) 
│ │ ├── components/ # AssetTable, ConnectionData, etc. 
│ │ └── api/ # API client 
│ └── package.json 
└── README.md
```

## Features Implemented

### Backend (Python/FastAPI)
- **Auto-updating Assets**: Assets update every 10 seconds with new values.  
- **Real-time Support**:  
  - **Server-Sent Events (SSE)**: `/api/assets/stream` endpoint.  
  - **WebSocket**: `/ws` endpoint for bidirectional communication.  

### Frontend (React + TypeScript)
- **TanStack Router**: File-based routing with a new dynamic route `/assets/$id` for asset detail view.  
- **TanStack Query**: Initial data fetching before real-time updates take over.  
- **Real-time Data Table**:  
  - Toggle between WebSocket and SSE connections.  
  - Row highlighting when assets update (visual feedback).  
  - Filtering by type (GLB/GLTF).  
  - Sorting by name or last modified date.  
- **Asset Detail View**:  
  - Clicking on an asset row navigates to `/assets/$id`.  
  - Displays detailed information with live updates.  
- **Error Handling**:  
  - Clear connection status indicators (Connected, Reconnecting, Disconnected).  
  - Exponential backoff for WebSocket reconnection attempts.  

## Getting Started

### Prerequisites
- Python 3.8+  
- Node.js 18+  
- npm or yarn  

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python main.py
# Or with uvicorn directly:
uvicorn main:app --reload --port 8000
```

5. Run the tests
```bash
python -m pytest -v tests
```
The backend will start on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Generate the route tree (required for TanStack Router):
```bash
npm install -g @tanstack/router-cli
# Or use npx:
npx @tanstack/router-cli generate
```

4. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Endpoints

### REST Endpoints
- `GET /` - API information and available endpoints
- `GET /api/assets` - Get all assets
- `GET /api/assets/{id}` - Get a specific asset by ID
- `GET /api/assets/stream` - Server-Sent Events stream for real-time updates

### WebSocket
- `WS /ws` - WebSocket connection for bidirectional real-time updates

## Technical Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **WebSockets**: Real-time bidirectional communication
- **Server-Sent Events**: One-way real-time updates
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **TanStack Router**: Type-safe routing
- **TanStack Query**: Server state management
- **Vite**: Build tool and dev server

## Architecture Highlights

### Backend Architecture
- **In-memory Storage**: Assets are stored in memory (suitable for demo/test)
- **Background Task**: Async task updates assets every 10 seconds
- **Broadcast Pattern**: Updates are broadcast to all connected clients
- **Connection Management**: WebSocket connections are tracked and cleaned up on disconnect

### Frontend Architecture
- **Custom Hooks**: Encapsulated real-time connection logic (`useWebSocket`, `useServerSentEvents`)
- **TanStack Query**: Initial data fetching and caching
- **Real-time Hooks**: Override query data with real-time updates
- **Component Separation**: Clear separation of concerns (table, hooks, API)


## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **Browser DevTools**: Use Network tab to inspect WebSocket/SSE connections
3. **Console Logging**: Both implementations log connection events to console
4. **Type Safety**: Leverage TypeScript for better IDE support and catching errors

## Troubleshooting

### Backend Issues
- Ensure port 8000 is not already in use
- Check Python version (3.8+ required)
- Verify all dependencies are installed

### Frontend Issues
- Ensure backend is running before starting frontend
- Clear browser cache if seeing stale data
- Check browser console for connection errors
- Regenerate route tree if routes aren't working: `npx @tanstack/router-cli generate`

### Connection Issues
- Verify CORS settings in backend if connecting from different origin
- Check WebSocket proxy settings in `vite.config.ts`
- Ensure firewall isn't blocking connections

## Design Choices
- Frontend Architecture: Modular components, hooks for real-time logic, TanStack Router for typed navigation.
- Real-time Implementation: Encapsulated WebSocket and SSE in separate hooks for clarity and reusability.
- User Experience: Clear connection indicators, smooth navigation, and visual feedback for updates.
- Backend: FastAPI foundation kept lightweight, with compatibility fixes for Pydantic.

## License

This project is submitted as part of a fullstack developer assessment.

