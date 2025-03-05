import '@galactic-tours/ui/theme.css'
import React, { useState } from 'react'
import { BrowserRouter, Route, Routes, useSearchParams } from 'react-router-dom'

import DestinationDetail from './components/DestinationDetail'
import { List } from './components/List'
import { Map } from './components/Map'
import { Navigation } from './components/Navigation'
import {
  DestinationsProvider,
  useDestinations,
} from './providers/DestinationsProvider'
import { MessageProvider } from './providers/MessageProvider'
import type { PathKeys } from './routes/PATHS'
import { PATHS } from './routes/PATHS'

type ViewType = Extract<PathKeys, 'MAP' | 'LIST' | 'DETAIL'>

const DetailView: React.FC = () => {
  const [searchParams] = useSearchParams()
  const destinationId = searchParams.get('id')

  return <DestinationDetail destinationId={destinationId} />
}

const HomeView: React.FC = () => {
  const [view, setView] = useState<ViewType>('MAP')
  const { activeDestination } = useDestinations()

  const handleViewChange = (newView: PathKeys) => {
    if (newView === 'MAP' || newView === 'LIST' || newView === 'DETAIL') {
      setView(newView)
    }
  }

  return (
    <>
      <Navigation
        routes={['MAP', 'LIST', 'DETAIL']}
        onViewChange={handleViewChange}
      />
      {view === 'MAP' ? (
        <Map />
      ) : view === 'LIST' ? (
        <List />
      ) : (
        <DestinationDetail destinationId={activeDestination?.id || null} />
      )}
    </>
  )
}

const App: React.FC = () => {
  return (
    <MessageProvider>
      <DestinationsProvider>
        <BrowserRouter>
          <Routes>
            <Route path={PATHS.HOME} element={<HomeView />} />
            <Route path={PATHS.MAP} element={<Map />} />
            <Route path={PATHS.LIST} element={<List />} />
            <Route path={PATHS.DETAIL} element={<DetailView />} />
          </Routes>
        </BrowserRouter>
      </DestinationsProvider>
    </MessageProvider>
  )
}

export default App
