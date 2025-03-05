import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import type { PathKeys } from '../../routes/PATHS'
import { getDetailPath, PATHS } from '../../routes/PATHS'

import { useDestinations } from '@/providers/DestinationsProvider'

interface NavigationProps {
  onViewChange?: (view: PathKeys) => void
  routes?: PathKeys[]
}

export const Navigation: React.FC<NavigationProps> = ({
  onViewChange,
  routes,
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { activeDestination } = useDestinations()

  const handleRouteClick = (route: PathKeys) => {
    if (onViewChange) {
      onViewChange(route)
      return
    }

    // For detail route, use the active destination ID if available
    if (route === 'DETAIL' && activeDestination) {
      navigate(getDetailPath(activeDestination.id))
    } else {
      navigate(PATHS[route])
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        gap: '10px',
      }}>
      {routes?.map((route) => (
        <button
          key={route}
          onClick={() => handleRouteClick(route)}
          style={{
            padding: '8px 16px',
            backgroundColor:
              location.pathname === PATHS[route]
                ? 'rgba(255, 255, 255, 0.2)'
                : 'transparent',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
          }}>
          {route}
        </button>
      ))}
    </div>
  )
}

export default Navigation
