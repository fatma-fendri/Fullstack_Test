import { useWebSocket } from '../hooks/useWebSocket'
import { useServerSentEvents } from '../hooks/useServerSentEvents'
import { Asset } from '../types'

export function ConnectionData({
  connectionType,
  children,
}: {
  connectionType: 'websocket' | 'sse'
  children: (data: { assets: Asset[]; isConnected: boolean }) => React.ReactNode
}) {
  const ws = connectionType === 'websocket' ? useWebSocket() : null
  const sse = connectionType === 'sse' ? useServerSentEvents() : null

  const assets = ws ? ws.assets : sse!.assets
  const isConnected = ws ? ws.isConnected : sse!.isConnected

  return <>{children({ assets, isConnected })}</>
}