import { createFileRoute } from '@tanstack/react-router'
import { AssetTable } from '../components/AssetTable'
import { useQuery } from '@tanstack/react-query'
import { assetApi } from '../api/assetApi'
import { useState } from 'react'
import './index.css'
import { ConnectionData } from '../components/ConnectionData'

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

  return (
    <div className="index-container">
      <div className="controls">
        <h2>Connection Method</h2>
        <div className="connection-buttons">
          <button
            className={`connection-btn ${connectionType === 'websocket' ? 'active' : ''}`}
            onClick={() => {
            console.log('🔌 Switching to WebSocket')
            setConnectionType('websocket')
            }}
          >
            WebSocket
          </button>
          <button
            className={`connection-btn ${connectionType === 'sse' ? 'active' : ''}`}
            onClick={() => {
            console.log('🔌 Switching to SSE')
            setConnectionType('sse')
            }}
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

      {/* key forces remounting when changing types => the previous hook cleans up */}
      <ConnectionData key={connectionType} connectionType={connectionType}>
        {({ assets, isConnected }) => {
          const displayAssets = assets.length > 0 ? assets : initialAssets
          return (
            <AssetTable
              assets={displayAssets}
              isConnected={isConnected}
              connectionType={connectionType}
            />
          )
        }}
      </ConnectionData>

    </div>
  )
}