import { createRootRoute, Outlet } from '@tanstack/react-router'
import '../index.css'

export const Route = createRootRoute({
  component: () => (
    <div className="app-container">
      <header className="app-header">
        <h1>Fullstack Dev Test - Real-time Assets</h1>
        <p>Showcase your WebSocket or Server-Sent Events skills</p>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  ),
})

