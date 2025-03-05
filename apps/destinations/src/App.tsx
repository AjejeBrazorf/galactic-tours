import '@galactic-tours/ui/theme.css'
import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { List } from './components/List'
import { Map } from './components/Map'
import { Navigation } from './components/Navigation'
import { DestinationsProvider } from './providers/DestinationsProvider'
import { MessageProvider } from './providers/MessageProvider'
import { PathKeys, PATHS } from './routes/PATHS'

type ViewType = Extract<PathKeys, 'MAP' | 'LIST'>

const HomeView: React.FC = () => {
  const [view, setView] = useState<ViewType>('MAP')

  const handleViewChange = (newView: PathKeys) => {
    if (newView === 'MAP' || newView === 'LIST') {
      setView(newView)
    }
  }

  return (
    <>
      <Navigation routes={['MAP', 'LIST']} onViewChange={handleViewChange} />
      {view === 'MAP' ? <Map /> : <List />}
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
          </Routes>
        </BrowserRouter>
      </DestinationsProvider>
    </MessageProvider>
  )
}

export default App
