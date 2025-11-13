# Fullstack Developer Test

## Overview

This is a fullstack development test designed for middle to senior level developers. The test evaluates your ability to work with real-time data, modern frontend frameworks, and backend API design.

## Project Structure

```
fullstack_dev_task/
├── backend/          # Python FastAPI backend
│   ├── main.py       # Main API server
│   └── requirements.txt
├── frontend/         # React + TypeScript frontend
│   ├── src/
│   │   ├── routes/   # TanStack Router routes
│   │   ├── hooks/    # Custom hooks (WebSocket, SSE)
│   │   ├── components/
│   │   └── api/      # API client
│   └── package.json
└── README.md
```

## Features

### Backend (Python/FastAPI)
- **Auto-updating Assets**: Multiple asset objects that automatically change their values every 10 seconds
- **Asset Properties**:
  - `id`: Unique identifier
  - `name`: Randomly generated asset name (e.g., "Character_Mesh", "Building_Structure")
  - `type`: Either "glb" or "gltf"
  - `last_modified`: Timestamp that updates on each change
- **Real-time Support**:
  - **Server-Sent Events (SSE)**: `/api/assets/stream` endpoint for one-way real-time updates
  - **WebSocket**: `/ws` endpoint for bidirectional real-time communication

### Frontend (React + TypeScript)
- **TanStack Router**: File-based routing system
- **TanStack Query**: Server state management and data fetching
- **Real-time Data Table**: Displays asset changes as they happen
- **Connection Methods**: Toggle between WebSocket and SSE implementations
- **Modern UI**: Beautiful, responsive design with connection status indicators

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

## Challenge Tasks

As a candidate, you may be asked to:

1. **Enhance Real-time Connectivity**
   - Improve error handling and reconnection logic
   - Add connection quality indicators
   - Implement message queuing for offline scenarios

2. **Optimize Performance**
   - Implement data diffing to reduce unnecessary re-renders
   - Add row-level change highlighting
   - Optimize TanStack Query cache strategy

3. **Add Features**
   - Filtering and sorting capabilities
   - Asset detail view with real-time updates
   - Bulk operations on assets
   - Export functionality

4. **Improve User Experience**
   - Loading states and skeletons
   - Error boundaries and error recovery
   - Toast notifications for connection status changes
   - Keyboard navigation

5. **Backend Enhancements**
   - Add pagination support
   - Implement asset creation/update/deletion endpoints
   - Add database persistence (replace in-memory storage)
   - Add authentication and authorization

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

## Evaluation Criteria

Candidates will be evaluated on:
- **Code Quality**: Clean, maintainable, well-structured code
- **Type Safety**: Proper TypeScript usage and type definitions
- **Error Handling**: Robust error handling and edge cases
- **Real-time Implementation**: Understanding of SSE vs WebSocket trade-offs
- **Performance**: Efficient data handling and rendering
- **Best Practices**: Following React and TypeScript best practices
- **Testing**: Ability to write tests (optional, but recommended)

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

## License

This is a test project for evaluation purposes.

## Questions?

Feel free to ask questions during the test. Good communication is part of being a senior developer!
