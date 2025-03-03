# @galactic-tours/messaging

A lightweight, framework-agnostic messaging package for microfrontend architecture that facilitates communication between iframes (microfrontends) and their parent (shell application).

## Features

- **Framework Agnostic Core**: Use with any JavaScript framework
- **React Integration**: First-class React support with hooks and context
- **Type-Safe**: Built with TypeScript for type safety
- **Bidirectional Communication**:
  - Parent to child iframes
  - Child iframes to parent
  - Between sibling iframes (mediated by parent)
- **Security Features**:
  - Origin validation
  - Message size validation
  - Protection against common security risks
- **Error Handling**:
  - Comprehensive error reporting
  - Request timeouts
  - Error boundaries

## Installation

```bash
# Using pnpm
pnpm add @galactic-tours/messaging
```

## Basic Usage

### Core Module (Framework Agnostic)

```typescript
import { createMessageBus, MessageDirection } from '@galactic-tours/messaging'

// Create a message bus in the parent (shell) application
const messageBus = createMessageBus({
  appId: 'shell',
  debug: true,
})

// Register child iframes when they are mounted
const registerIframe = (id, iframeElement) => {
  messageBus.registerChild(id, iframeElement)
}

// Subscribe to messages
messageBus.subscribe('user.selected', (message) => {
  console.log('User selected:', message.payload)
})

// Send a message to all children
messageBus.send('theme.changed', { theme: 'dark' })

// Send a message to a specific child
messageBus.send(
  'navigation.update',
  { page: 'home' },
  {
    target: 'destinations-app',
  }
)

// Request-response pattern
messageBus
  .request('data.fetch', { id: '123' })
  .then((response) => {
    console.log('Data received:', response)
  })
  .catch((error) => {
    console.error('Error fetching data:', error)
  })

// Cleanup when no longer needed
messageBus.destroy()
```

### Child Application

```typescript
import { createMessageBus, MessageDirection } from '@galactic-tours/messaging'

// Create a message bus in the child application
const messageBus = createMessageBus({
  appId: 'destinations-app',
  debug: true,
})

// Subscribe to messages from parent
messageBus.subscribe('theme.changed', (message) => {
  applyTheme(message.payload.theme)
})

// Send a message to the parent
messageBus.send('user.selected', { userId: '123', name: 'John Doe' })

// Send a message to a sibling through the parent
messageBus.send(
  'bookingUpdated',
  { bookingId: '456' },
  {
    target: 'bookings-app',
    direction: MessageDirection.CHILD_TO_CHILD,
  }
)

// Respond to requests
messageBus.subscribe('data.fetch', (message) => {
  if (isRequestMessage(message)) {
    // Get the data
    const data = fetchLocalData(message.payload.id)

    // Send a response
    messageBus.send(`${message.type}.response`, data, {
      target: message.source,
      correlationId: message.correlationId,
      success: true,
    })
  }
})
```

### React Integration

```tsx
import {
  createMessageBus,
  MessageBusProvider,
  useContextMessaging
} from '@galactic-tours/messaging';
import React, { useEffect } from 'react';

// Create the message bus
const messageBus = createMessageBus({
  appId: 'destinations-app',
  debug: true
});

// Root component with provider
function App() {
  return (
    <MessageBusProvider messageBus={messageBus}>
      <DestinationsList />
    </MessageBusProvider>
  );
}

// Component using the messaging hook
function DestinationsList() {
  const { send, subscribe, request } = useContextMessaging();

  useEffect(() => {
    // Subscribe to messages
    const unsubscribe = subscribe('destinations.filter', (message) => {
      // Apply filters
      applyFilters(message.payload);
    });

    return unsubscribe; // Cleanup on unmount
  }, [subscribe]);

  const handleSelect = (destination) => {
    // Send a message when a destination is selected
    send('destination.selected', destination);
  };

  const loadDetails = async (id) => {
    try {
      // Request-response pattern
      const details = await request('destination.details', { id });
      // Update UI with details
      updateUI(details);
    } catch (error) {
      // Handle error
      showError(error);
    }
  };

  return (
    // Component JSX...
  );
}
```

## Typed Messages

The package supports typed messages with TypeScript:

```typescript
import {
  defineMessageType,
  createMessageNamespace,
} from '@galactic-tours/messaging'

// Define a message type
interface UserSelectedPayload {
  userId: string
  name: string
  role: string
}

// Create a typed message definition
const UserSelectedMessage =
  defineMessageType<UserSelectedPayload>('user.selected')

// Check if a message is of this type
messageBus.subscribe('*', (message) => {
  if (UserSelectedMessage.is(message)) {
    // TypeScript knows this is a UserSelectedPayload
    console.log(message.payload.name)
  }
})

// Create namespaced messages to avoid collisions
const userMessages = createMessageNamespace('user')

const UserCreatedMessage = userMessages.defineMessageType<{ id: string }>(
  'created'
)
// This will have type 'user/created'
```

## Security

### Origin Validation

```typescript
const messageBus = createMessageBus({
  appId: 'shell',
  origin: {
    validateOrigin: true,
    allowedOrigins: ['https://app1.example.com', 'https://app2.example.com'],
  },
})
```

## Error Handling

The package provides several error handling mechanisms:

```typescript
// Set a default timeout for all requests
const messageBus = createMessageBus({
  appId: 'shell',
  defaultTimeout: 3000, // 3 seconds
})

// Custom timeout for a specific request
messageBus
  .request('data.fetch', { id: '123' }, { timeout: 5000 })
  .then((response) => {
    console.log('Data received:', response)
  })
  .catch((error) => {
    // Handle timeout or other errors
    console.error('Error:', error)
  })

// Subscribe to error messages
messageBus.subscribe('error', (errorMessage) => {
  console.error('Message bus error:', errorMessage)
})
```
