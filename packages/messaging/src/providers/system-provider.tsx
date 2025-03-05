/**
 * System Provider
 *
 * Manages system-level state and messaging across microfrontends.
 * Handles application readiness, errors, and configuration.
 */

import type { ReactNode } from 'react'
import React, { createContext, useContext, useEffect, useState } from 'react'

import type {
  SystemConfigPayload,
  SystemErrorPayload,
  SystemReadyPayload,
} from '../constants/message-payloads'
import { SYSTEM_MESSAGES } from '../constants/message-types'

import {
  createTypedMessageSender,
  createTypedMessageSubscriber,
  useMessage,
} from './message-provider'

// System context interface
interface SystemContextType {
  // State
  errors: SystemErrorPayload[]
  readyApps: string[]
  isLoading: boolean
  config: Record<string, any>
  // Actions
  clearErrors: () => void
  updateConfig: (config: Partial<Record<string, any>>) => void
}

// Create the context
const SystemContext = createContext<SystemContextType | null>(null)

// Provider props
interface SystemProviderProps {
  children: ReactNode
  appId: string
  initialConfig?: Record<string, any>
}

/**
 * Provider for system-level state and messaging
 */
export const SystemProvider: React.FC<SystemProviderProps> = ({
  children,
  appId,
  initialConfig = {},
}) => {
  // State
  const [errors, setErrors] = useState<SystemErrorPayload[]>([])
  const [readyApps, setReadyApps] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [config, setConfig] = useState<Record<string, any>>(initialConfig)

  // Get the message bus
  const messageBus = useMessage()

  // Create typed message senders
  const sendSystemError = createTypedMessageSender<SystemErrorPayload>(
    messageBus,
    SYSTEM_MESSAGES.ERROR
  )

  const sendSystemConfig = createTypedMessageSender<SystemConfigPayload>(
    messageBus,
    SYSTEM_MESSAGES.CONFIG_UPDATED
  )

  // Set up message subscriptions
  useEffect(() => {
    // Subscribe to app ready messages
    const readySubscriber = createTypedMessageSubscriber<SystemReadyPayload>(
      messageBus,
      SYSTEM_MESSAGES.APP_READY
    )

    const unsubReady = readySubscriber((payload) => {
      setReadyApps((prev) => {
        if (prev.includes(payload.appId)) return prev
        return [...prev, payload.appId]
      })

      // After some apps are ready, consider the system no longer loading
      setIsLoading(false)
    })

    // Subscribe to error messages
    const errorSubscriber = createTypedMessageSubscriber<SystemErrorPayload>(
      messageBus,
      SYSTEM_MESSAGES.ERROR
    )

    const unsubError = errorSubscriber((payload) => {
      setErrors((prev) => [...prev, payload])
    })

    // Subscribe to config updates
    const configSubscriber = createTypedMessageSubscriber<SystemConfigPayload>(
      messageBus,
      SYSTEM_MESSAGES.CONFIG_UPDATED
    )

    const unsubConfig = configSubscriber((payload) => {
      setConfig((prev) => ({
        ...prev,
        ...payload.config,
      }))
    })

    // Consider the system "loaded" after a timeout even if not all apps report ready
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false)
    }, 5000)

    // Clean up subscriptions
    return () => {
      unsubReady()
      unsubError()
      unsubConfig()
      clearTimeout(loadingTimeout)
    }
  }, [messageBus])

  // System actions
  const clearErrors = () => {
    setErrors([])
  }

  const updateConfig = (newConfig: Partial<Record<string, any>>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig }

      // Broadcast config update
      sendSystemConfig({
        source: appId,
        timestamp: Date.now(),
        config: newConfig,
      })

      return updated
    })
  }

  // Context value
  const contextValue: SystemContextType = {
    errors,
    readyApps,
    isLoading,
    config,
    clearErrors,
    updateConfig,
  }

  return (
    <SystemContext.Provider value={contextValue}>
      {children}
    </SystemContext.Provider>
  )
}

/**
 * Hook for accessing system context
 */
export const useSystem = (): SystemContextType => {
  const context = useContext(SystemContext)
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider')
  }
  return context
}
