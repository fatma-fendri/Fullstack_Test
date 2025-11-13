import { Asset } from '../types'
import './AssetTable.css'

interface AssetTableProps {
  assets: Asset[]
  isConnected: boolean
  connectionType: 'websocket' | 'sse'
}

export function AssetTable({ assets, isConnected, connectionType }: AssetTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const getTypeBadgeClass = (type: string) => {
    return type === 'glb' ? 'badge-glb' : 'badge-gltf'
  }

  return (
    <div className="asset-table-container">
      <div className="connection-status">
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          <span className="connection-type">({connectionType.toUpperCase()})</span>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table className="asset-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  Loading assets...
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="asset-row">
                  <td className="asset-id">{asset.id.substring(0, 8)}...</td>
                  <td className="asset-name">{asset.name}</td>
                  <td>
                    <span className={`type-badge ${getTypeBadgeClass(asset.type)}`}>
                      {asset.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="asset-date">{formatDate(asset.last_modified)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="table-footer">
        <p>Total Assets: {assets.length}</p>
        <p className="update-info">
          Assets update every 10 seconds automatically
        </p>
      </div>
    </div>
  )
}

