import { useEffect, useRef, useState } from 'react'
import { Asset } from '../types'

export function useServerSentEvents() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const eventSource = new EventSource('/api/assets/stream')
    eventSourceRef.current = eventSource
    
    eventSource.onopen = () => {
      setIsConnected(true)
      console.log('SSE connection opened')
    }

    eventSource.onmessage = (event) => {
      try {
        const data: Asset[] = JSON.parse(event.data)
        setAssets(data)
      } catch (error) {
        console.error('Error parsing SSE message:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      setIsConnected(false)
      // EventSource will automatically attempt to reconnect
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      setIsConnected(false)
    }
  }, [])

  return { assets, isConnected }
}

