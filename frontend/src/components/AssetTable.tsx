import { useEffect, useRef, useState, useMemo } from 'react'
import { Asset } from '../types'
import './AssetTable.css'
import { Link } from '@tanstack/react-router'

interface AssetTableProps {
  assets: Asset[]
  isConnected: boolean
  connectionType: 'websocket' | 'sse'
}

export function AssetTable({ assets, isConnected, connectionType }: AssetTableProps) {
  // Store the previous asset list to compare changes
  const previousAssetsRef = useRef<Asset[]>([])
  
  // Track which asset rows should be highlighted
  const [highlightedRows, setHighlightedRows] = useState<string[]>([])

  // Track reconnecting state 
  const [isReconnecting, setIsReconnecting] = useState(false)

  // Track filter and sort options
  const [filterType, setFilterType] = useState<'all' | 'glb' | 'gltf'>('all')
  const [sortOption, setSortOption] = useState<'name' | 'date'>('date')

  // Format the date string for display
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

  // Return a CSS class based on asset type
  const getTypeBadgeClass = (type: string) => {
    return type === 'glb' ? 'badge-glb' : 'badge-gltf'
  }

  // Detect changes in asset data and highlight updated rows
  useEffect(() => {
    const changedIds: string[] = []

    // Compare current assets with previous ones
    assets.forEach((asset) => {
      const previous = previousAssetsRef.current.find((a) => a.id === asset.id)
      if (previous && JSON.stringify(previous) !== JSON.stringify(asset)) {
        changedIds.push(asset.id)
      }
    })

    // If changes are detected, highlight the affected rows
    if (changedIds.length > 0) {
      setHighlightedRows(changedIds)

      // Remove highlight after 3 seconds
      const timeout = setTimeout(() => {
        setHighlightedRows([])
      }, 3000)

      // Cleanup timeout if assets change again before 3 seconds
      return () => clearTimeout(timeout)
    }

    // Update the reference with the latest asset list
    previousAssetsRef.current = assets
  }, [assets])

  // Detect reconnecting state (Task 3)
  useEffect(() => {
    if (!isConnected) {
      setIsReconnecting(true)
      // After 5 seconds, assume still disconnected → show "Disconnected"
      const timeout = setTimeout(() => setIsReconnecting(false), 5000)
      return () => clearTimeout(timeout)
    } else {
      setIsReconnecting(false)
    }
  }, [isConnected])

  // Apply filtering and sorting
  const displayedAssets = useMemo(() => {
    let filtered = assets

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(asset => asset.type.toLowerCase() === filterType)
    }

    // Sort by name or date
    if (sortOption === 'name') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOption === 'date') {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime()
      )
    }

    return filtered
  }, [assets, filterType, sortOption])

  return (
    <div className="asset-table-container">
      {/* Connection status */}
      <div className="connection-status">
        <div className={`status-indicator ${
            isConnected ? 'connected' : isReconnecting ? 'reconnecting' : 'disconnected' }`}>
          <span className="status-dot"></span>
          <span>
            {isConnected
              ? 'Connected'
              : isReconnecting
              ? 'Reconnecting...'
              : 'Disconnected'}
          </span>
          <span className="connection-type">({connectionType.toUpperCase()})</span>
        </div>
      </div>
      {/* Filters and sorting */}
      <div className="filters">
        <label>
          Filter by type:
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'glb' | 'gltf')}
          >
            <option value="all">All</option>
            <option value="glb">GLB</option>
            <option value="gltf">GLTF</option>
          </select>
        </label>

        <label>
          Sort by:
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as 'name' | 'date')}
          >
            <option value="date">Last Modified</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>
      {/* Asset table */}
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
            {displayedAssets.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  No assets found...
                </td>
              </tr>
            ) : (
              displayedAssets.map((asset) => (
                <tr 
                    key={asset.id} 
                    // Apply highlight class if asset was recently updated
                    className={`asset-row ${highlightedRows.includes(asset.id) ? 'highlighted' : ''}`}
                >
                  {/* Link to detail view */}
                  <td className="asset-id">
                    <Link to="/assets/$id" params={{ id: asset.id }}>
                      {asset.id.substring(0, 8)}...
                    </Link>
                  </td>
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
      {/* Footer */}
      <div className="table-footer">
        <p>Total Assets: {displayedAssets.length}</p>
        <p className="update-info">
          Assets update every 10 seconds automatically
        </p>
      </div>
    </div>
  )
}