import { createFileRoute } from '@tanstack/react-router'
import './AssetDetail.css'
import { useWebSocket } from '../hooks/useWebSocket'
import { useServerSentEvents } from '../hooks/useServerSentEvents'
import { useMemo } from 'react'

export const Route = createFileRoute('/assets/$id')({
  component: AssetDetail,
})

function AssetDetail() {
  // typed params from the route
  const { id } = Route.useParams()

  // reuse real-time hooks
  const { assets: wsAssets, isConnected: wsConnected } = useWebSocket()
  const { assets: sseAssets, isConnected: sseConnected } = useServerSentEvents()

  // choose source (in practice, pass connectionType via context/prop)
  const assets = wsAssets.length ? wsAssets : sseAssets
  const isConnected = wsAssets.length ? wsConnected : sseConnected

  const asset = useMemo(() => assets.find(a => a.id === id) ?? null, [assets, id])

  if (!asset) {
    return (
      <div className="asset-detail">
        <h2>Asset Detail</h2>
        <p>Loading or not found.</p>
        <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      </div>
    )
  }

  return (
    <div className="asset-detail">
      <h2>Asset Detail: {asset.name}</h2>
      <p><strong>ID:</strong> {asset.id}</p>
      <p><strong>Type:</strong> {asset.type}</p>
      <p><strong>Last Modified:</strong> {asset.last_modified}</p>
      <p><strong>Status:</strong> {isConnected ? 'Connected' : 'Disconnected'}</p>
    </div>
  )
}