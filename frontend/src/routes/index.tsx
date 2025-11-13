import { createFileRoute } from '@tanstack/react-router'
import { AssetTable } from '../components/AssetTable'
import { useQuery } from '@tanstack/react-query'
import { assetApi } from '../api/assetApi'
import { useState } from 'react'
import { useWebSocket } from '../hooks/useWebSocket'
import { useServerSentEvents } from '../hooks/useServerSentEvents'
import './index.css'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [connectionType, setConnectionType] = useState<'websocket' | 'sse'>('websocket')
  
  // Initial fetch with TanStack Query
  const { data: initialAssets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: assetApi.getAllAssets,
    refetchInterval: false, // We'll use real-time updates instead
  })

  // Conditionally use WebSocket or SSE based on connectionType
  // Note: In a production app, you'd want to conditionally render/use hooks
  // For this test, both hooks run but we only use the active one
  const { assets: wsAssets, isConnected: wsConnected } = useWebSocket()
  const { assets: sseAssets, isConnected: sseConnected } = useServerSentEvents()

  // Use the appropriate data source based on connection type
  const assets = connectionType === 'websocket' ? wsAssets : sseAssets
  const isConnected = connectionType === 'websocket' ? wsConnected : sseConnected

  // Fallback to initial query data if real-time data is not available yet
  const displayAssets = assets.length > 0 ? assets : initialAssets

  return (
    <div className="index-container">
      <div className="controls">
        <h2>Connection Method</h2>
        <div className="connection-buttons">
          <button
            className={`connection-btn ${connectionType === 'websocket' ? 'active' : ''}`}
            onClick={() => setConnectionType('websocket')}
          >
            WebSocket
          </button>
          <button
            className={`connection-btn ${connectionType === 'sse' ? 'active' : ''}`}
            onClick={() => setConnectionType('sse')}
          >
            Server-Sent Events (SSE)
          </button>
        </div>
        <p className="instruction">
          Choose a connection method to see real-time updates. Assets change every 10 seconds.
          <br />
          <strong>Challenge:</strong> Implement or enhance the real-time connection handling!
        </p>
      </div>

      <AssetTable
        assets={displayAssets}
        isConnected={isConnected}
        connectionType={connectionType}
      />
    </div>
  )
}
