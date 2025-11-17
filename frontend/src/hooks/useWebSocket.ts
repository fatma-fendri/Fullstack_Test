import { useEffect, useRef, useState } from 'react'
import { Asset } from '../types'

interface WebSocketMessage {
  type: 'initial' | 'update' | 'pong'
  data: Asset[]
  message?: string
}

export function useWebSocket() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  //exponential backoff delay
  const [retryDelay, setRetryDelay] = useState(3000) 

  useEffect(() => {
    let isUnmounted = false
    const connect = () => {
      //prevent reconnect if unmounted
      if (isUnmounted) return
      // Use the proxy URL or direct connection
      
      const wsUrl = import.meta.env.DEV 
        ? 'ws://localhost:8000/ws' 
        : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`
      
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
      if (!isUnmounted) {
        setIsConnected(true)
        // reset delay on success
        setRetryDelay(3000)
        console.log('WebSocket connected')
      }
    }

      ws.onmessage = (event) => {
        if (!isUnmounted) {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            if (message.type === 'initial' || message.type === 'update') {
              setAssets(message.data)
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
        }
      }
      }

      ws.onerror = (error) => {
        if (!isUnmounted) {
        console.error('WebSocket error:', error)
        setIsConnected(false)
      }
      }

      ws.onclose = () => {
        if (!isUnmounted) {
          setIsConnected(false)
          console.log('WebSocket disconnected, attempting reconnect...')
          
          // exponential backoff for reconnection
          reconnectTimeoutRef.current = setTimeout(() => {
            setRetryDelay(Math.min(retryDelay * 2, 30000)) // max 30s
            connect()
          }, retryDelay)
        }
      }

      wsRef.current = ws
    }

    connect()

    return () => {
      isUnmounted = true
      if (reconnectTimeoutRef.current)  clearTimeout(reconnectTimeoutRef.current)
      if (wsRef.current) wsRef.current.close()
    }
  }, [retryDelay])

  const sendMessage = (message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message)
    }
  }

  return { assets, isConnected, sendMessage }
}