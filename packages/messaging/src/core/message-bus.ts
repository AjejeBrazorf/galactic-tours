import {
  BaseMessage,
  ErrorMessage,
  Message,
  MessageBusOptions,
  MessageDirection,
  MessageHandler,
  RequestMessage,
  ResponseMessage,
  SubscriptionOptions,
  isRequestMessage,
  isResponseMessage,
} from '../types'

/**
 * Default message bus options
 */
const DEFAULT_OPTIONS: Partial<MessageBusOptions> = {
  debug: false,
  defaultTimeout: 5000,
  maxMessageSize: 1024 * 1024, // 1MB
  origin: {
    validateOrigin: true,
    allowedOrigins: ['*'],
  },
}

/**
 * Message event listener with filter
 */
interface MessageSubscription {
  id: string
  handler: MessageHandler
  type: string
  options?: SubscriptionOptions
}

/**
 * Pending request tracking
 */
interface PendingRequest {
  correlationId: string
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
  timeout: NodeJS.Timeout
}

/**
 * Core message bus for iframe communication
 */
export class MessageBus {
  private options: MessageBusOptions
  private subscriptions: Map<string, MessageSubscription> = new Map()
  private pendingRequests: Map<string, PendingRequest> = new Map()
  private isParent: boolean
  private childFrames: Map<string, Window> = new Map()

  /**
   * Create a new message bus
   */
  constructor(options: MessageBusOptions) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
    this.isParent = window.self === window.top

    // Start listening for messages
    this.setupEventListener()

    this.log('MessageBus initialized', {
      appId: this.options.appId,
      isParent: this.isParent,
      options: this.options,
    })
  }

  /**
   * Register a child iframe
   * Used by parent to store references to children for direct communication
   */
  registerChild(childId: string, frame: HTMLIFrameElement): void {
    if (!this.isParent) {
      this.logError('Only parent windows can register children')
      return
    }

    if (frame.contentWindow) {
      this.childFrames.set(childId, frame.contentWindow)
      this.log(`Registered child iframe: ${childId}`)
    } else {
      this.logError(
        `Cannot register child iframe: ${childId}, contentWindow is null`
      )
    }
  }

  /**
   * Unregister a child iframe
   */
  unregisterChild(childId: string): void {
    if (this.childFrames.delete(childId)) {
      this.log(`Unregistered child iframe: ${childId}`)
    }
  }

  /**
   * Get all registered child frames
   */
  getChildFrames(): Map<string, Window> {
    return new Map(this.childFrames)
  }

  /**
   * Set up the message event listener
   */
  private setupEventListener(): void {
    window.addEventListener(
      'message',
      this.handleIncomingMessage.bind(this),
      false
    )
  }

  /**
   * Handle incoming message event
   */
  private handleIncomingMessage(event: MessageEvent): void {
    // Security: Origin validation
    if (this.options.origin?.validateOrigin) {
      const isAllowed =
        this.options.origin.allowedOrigins.includes('*') ||
        this.options.origin.allowedOrigins.includes(event.origin)

      if (!isAllowed) {
        this.logError(`Message from unauthorized origin: ${event.origin}`)
        return
      }
    }

    // Ensure it's our message format
    const message = event.data as BaseMessage
    if (!this.isValidMessage(message)) {
      return
    }

    this.log('Received message', message)

    // Handle request-response pattern
    if (isResponseMessage(message)) {
      this.handleResponseMessage(message as ResponseMessage)
      return
    }

    // Process message with subscribers
    const subscriptions = Array.from(this.subscriptions.values())
      .filter((sub) => sub.type === message.type || sub.type === '*')
      .filter((sub) => {
        // Apply custom filter if provided
        if (sub.options?.filter && !sub.options.filter(message)) {
          return false
        }
        return true
      })

    // No subscribers for this message type
    if (subscriptions.length === 0) {
      this.log(`No subscribers for message type: ${message.type}`)

      // If it's a request, respond with error
      if (isRequestMessage(message)) {
        this.sendErrorResponse(
          message as RequestMessage,
          'NOT_HANDLED',
          'No handlers for this message type'
        )
      }
      return
    }

    // Forward message to child if needed
    if (
      this.isParent &&
      message.direction === MessageDirection.CHILD_TO_CHILD &&
      message.target
    ) {
      this.forwardToChild(message)
    }

    // Notify subscribers
    subscriptions.forEach((subscription) => {
      try {
        subscription.handler(message as Message)

        // Remove subscription if it's one-time
        if (subscription.options?.once) {
          this.unsubscribe(subscription.id)
        }
      } catch (err) {
        this.logError('Error in message handler', err)
      }
    })
  }

  /**
   * Handle response message for request-response pattern
   */
  private handleResponseMessage(response: ResponseMessage): void {
    const pendingRequest = this.pendingRequests.get(response.correlationId)
    if (!pendingRequest) {
      this.log(
        `No pending request found for correlation ID: ${response.correlationId}`
      )
      return
    }

    // Clear timeout and remove from pending requests
    clearTimeout(pendingRequest.timeout)
    this.pendingRequests.delete(response.correlationId)

    // Resolve or reject the promise
    if (response.success) {
      pendingRequest.resolve(response.payload)
    } else {
      pendingRequest.reject(
        response.error || { code: 'UNKNOWN', message: 'Unknown error' }
      )
    }
  }

  /**
   * Send an error response for a request
   */
  private sendErrorResponse(
    request: RequestMessage,
    code: string,
    message: string
  ): void {
    const response: ResponseMessage = {
      id: this.generateId(),
      type: `${request.type}.response`,
      timestamp: Date.now(),
      source: this.options.appId,
      target: request.source,
      direction: this.getResponseDirection(request.direction),
      correlationId: request.correlationId,
      success: false,
      payload: null,
      error: { code, message },
    }

    this.sendMessage(response)
  }

  /**
   * Get the appropriate direction for a response based on request direction
   */
  private getResponseDirection(
    requestDirection: MessageDirection
  ): MessageDirection {
    switch (requestDirection) {
      case MessageDirection.PARENT_TO_CHILD:
        return MessageDirection.CHILD_TO_PARENT
      case MessageDirection.CHILD_TO_PARENT:
        return MessageDirection.PARENT_TO_CHILD
      case MessageDirection.CHILD_TO_CHILD:
        return MessageDirection.CHILD_TO_CHILD
      default:
        return MessageDirection.CHILD_TO_PARENT
    }
  }

  /**
   * Forward a message to a child iframe
   */
  private forwardToChild(message: BaseMessage): void {
    if (!message.target) {
      this.logError('Cannot forward message: no target specified')
      return
    }

    const targetWindow = this.childFrames.get(message.target)
    if (!targetWindow) {
      this.logError(
        `Cannot forward message: target child not found: ${message.target}`
      )

      // Send error back to source
      const errorMessage: ErrorMessage = {
        id: this.generateId(),
        type: 'error',
        timestamp: Date.now(),
        source: this.options.appId,
        target: message.source,
        direction: this.getResponseDirection(message.direction),
        code: 'TARGET_NOT_FOUND',
        message: `Target child not found: ${message.target}`,
        originalMessage: message,
      }

      this.sendMessage(errorMessage)
      return
    }

    // Determine the target origin
    // For security in production, you should use a specific origin instead of '*'
    const targetOrigin = '*'

    try {
      targetWindow.postMessage(message, targetOrigin)
      this.log(`Forwarded message to child: ${message.target}`, message)
    } catch (err) {
      this.logError(`Error forwarding message to child: ${message.target}`, err)
    }
  }

  /**
   * Check if a message has the required format
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isValidMessage(message: any): message is BaseMessage {
    return (
      message &&
      typeof message === 'object' &&
      typeof message.type === 'string' &&
      typeof message.id === 'string' &&
      typeof message.source === 'string' &&
      typeof message.timestamp === 'number' &&
      typeof message.direction === 'string'
    )
  }

  /**
   * Generate a unique ID for messages
   */
  private generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    )
  }

  /**
   * Subscribe to messages of a specific type
   */
  subscribe<T = unknown>(
    type: string,
    handler: MessageHandler<T>,
    options?: SubscriptionOptions
  ): string {
    const subscriptionId = this.generateId()

    this.subscriptions.set(subscriptionId, {
      id: subscriptionId,
      type,
      handler: handler as MessageHandler,
      options,
    })

    this.log(`Subscribed to message type: ${type}`, { subscriptionId })

    return subscriptionId
  }

  /**
   * Unsubscribe from messages
   */
  unsubscribe(subscriptionId: string): boolean {
    const result = this.subscriptions.delete(subscriptionId)
    if (result) {
      this.log(`Unsubscribed: ${subscriptionId}`)
    }
    return result
  }

  /**
   * Send a message
   */
  send<T = unknown>(
    type: string,
    payload: T,
    options?: {
      target?: string
      direction?: MessageDirection
    }
  ): void {
    const direction =
      options?.direction ||
      (this.isParent
        ? MessageDirection.PARENT_TO_CHILD
        : MessageDirection.CHILD_TO_PARENT)

    const message: Message<T> = {
      id: this.generateId(),
      type,
      timestamp: Date.now(),
      source: this.options.appId,
      target: options?.target,
      direction,
      payload,
    }

    this.sendMessage(message)
  }

  /**
   * Request-response pattern
   * Returns a promise that resolves with the response or rejects on timeout/error
   */
  request<TReq = unknown, TRes = unknown>(
    type: string,
    payload: TReq,
    options?: {
      target?: string
      timeout?: number
      direction?: MessageDirection
    }
  ): Promise<TRes> {
    return new Promise<TRes>((resolve, reject) => {
      const correlationId = this.generateId()
      const timeout = options?.timeout || this.options.defaultTimeout || 5000

      const direction =
        options?.direction ||
        (this.isParent
          ? MessageDirection.PARENT_TO_CHILD
          : MessageDirection.CHILD_TO_PARENT)

      // Create the request message
      const requestMessage: RequestMessage<TReq> = {
        id: this.generateId(),
        type,
        timestamp: Date.now(),
        source: this.options.appId,
        target: options?.target,
        direction,
        correlationId,
        payload,
      }

      // Set up timeout
      const timeoutId = setTimeout(() => {
        if (this.pendingRequests.has(correlationId)) {
          this.pendingRequests.delete(correlationId)
          reject(new Error(`Request ${type} timed out after ${timeout}ms`))
        }
      }, timeout)

      // Track the pending request
      this.pendingRequests.set(correlationId, {
        correlationId,
        resolve,
        reject,
        timeout: timeoutId,
      })

      // Send the request
      this.sendMessage(requestMessage)
    })
  }

  /**
   * Send a message to the appropriate target
   */
  private sendMessage(message: BaseMessage): void {
    if (this.options.maxMessageSize) {
      const size = JSON.stringify(message).length
      if (size > this.options.maxMessageSize) {
        this.logError(
          `Message size (${size} bytes) exceeds maximum allowed size (${this.options.maxMessageSize} bytes)`
        )
        return
      }
    }

    this.log('Sending message', message)

    try {
      if (this.isParent) {
        this.sendFromParent(message)
      } else {
        this.sendFromChild(message)
      }
    } catch (err) {
      this.logError('Error sending message', err)
    }
  }

  /**
   * Send a message from the parent to children
   */
  private sendFromParent(message: BaseMessage): void {
    if (message.target) {
      // Send to specific child
      const childWindow = this.childFrames.get(message.target)
      if (childWindow) {
        childWindow.postMessage(message, '*')
      } else {
        this.logError(`Target child not found: ${message.target}`)
      }
    } else {
      // Broadcast to all children
      this.childFrames.forEach((childWindow) => {
        childWindow.postMessage(message, '*')
      })
    }
  }

  /**
   * Send a message from a child to parent or other children
   */
  private sendFromChild(message: BaseMessage): void {
    if (
      window.parent &&
      (message.direction === MessageDirection.CHILD_TO_PARENT ||
        message.direction === MessageDirection.CHILD_TO_CHILD)
    ) {
      // Send to parent (parent will forward to other children if needed)
      window.parent.postMessage(message, '*')
    } else {
      this.logError(`Invalid message direction for child: ${message.direction}`)
    }
  }

  /**
   * Log a message if debug is enabled
   */
  private log(message: string, data?: unknown): void {
    if (this.options.debug) {
      console.log(`[MessageBus:${this.options.appId}]`, message, data || '')
    }
  }

  /**
   * Log an error
   */
  private logError(message: string, error?: unknown): void {
    console.error(
      `[MessageBus:${this.options.appId}] ERROR:`,
      message,
      error || ''
    )
  }

  /**
   * Cleanup and remove all event listeners
   */
  destroy(): void {
    window.removeEventListener('message', this.handleIncomingMessage.bind(this))
    this.subscriptions.clear()

    // Clear all pending request timeouts
    this.pendingRequests.forEach((request) => {
      clearTimeout(request.timeout)
      request.reject(new Error('MessageBus destroyed'))
    })
    this.pendingRequests.clear()

    this.childFrames.clear()
    this.log('MessageBus destroyed')
  }
}
