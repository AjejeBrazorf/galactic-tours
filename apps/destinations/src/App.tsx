import '@galactic-tours/ui/theme.css'
import React from 'react'

import { Map } from './components/Map'
import { DestinationsProvider } from './providers/DestinationsProvider'
import { MessageProvider } from './providers/MessageProvider'

const App: React.FC = () => {
  return (
    <MessageProvider>
      <DestinationsProvider>
        <Map />
      </DestinationsProvider>
    </MessageProvider>
  )
}

export default App
