import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PathKeys, PATHS } from '../../routes/PATHS'

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
          onClick={() => {
            if (onViewChange) {
              onViewChange(route)
              return
            }
            navigate(PATHS[route])
          }}
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
