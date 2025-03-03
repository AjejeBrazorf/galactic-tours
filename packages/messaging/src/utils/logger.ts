export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  NONE = 'none',
}

export interface LoggerConfig {
  /** App identifier (prepended to log messages) */
  appId: string
  /** Minimum log level to output */
  level: LogLevel
  /** Whether to include timestamps in logs */
  timestamps?: boolean
  /** Custom log function (default: console) */
  logFn?: (level: LogLevel, message: string, data?: unknown) => void
}

/**
 * Default logger configuration
 */
const DEFAULT_CONFIG: Partial<LoggerConfig> = {
  level: LogLevel.INFO,
  timestamps: true,
}

/**
 * Logger for the messaging system
 */
export class Logger {
  private config: LoggerConfig

  constructor(config: LoggerConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Debug level log
   */
  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data)
  }

  /**
   * Info level log
   */
  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data)
  }

  /**
   * Warning level log
   */
  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data)
  }

  /**
   * Error level log
   */
  error(message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, message, data)
  }

  /**
   * Internal logging implementation
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    if (this.shouldLog(level)) {
      const formattedMessage = this.formatMessage(level, message)

      if (this.config.logFn) {
        this.config.logFn(level, formattedMessage, data)
      } else {
        this.consoleLog(level, formattedMessage, data)
      }
    }
  }

  /**
   * Format a log message
   */
  private formatMessage(level: LogLevel, message: string): string {
    const parts = [`[${this.config.appId}]`]

    if (this.config.timestamps) {
      parts.push(`[${new Date().toISOString()}]`)
    }

    parts.push(`[${level.toUpperCase()}]`)
    parts.push(message)

    return parts.join(' ')
  }

  /**
   * Check if a message should be logged based on the current log level
   */
  private shouldLog(level: LogLevel): boolean {
    if (this.config.level === LogLevel.NONE) {
      return false
    }

    const levels = [
      LogLevel.DEBUG,
      LogLevel.INFO,
      LogLevel.WARN,
      LogLevel.ERROR,
    ]
    const configLevelIndex = levels.indexOf(this.config.level)
    const messageLevelIndex = levels.indexOf(level)

    return messageLevelIndex >= configLevelIndex
  }

  /**
   * Log to the console
   */
  private consoleLog(level: LogLevel, message: string, data?: unknown): void {
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(message, data !== undefined ? data : '')
        break
      case LogLevel.INFO:
        console.info(message, data !== undefined ? data : '')
        break
      case LogLevel.WARN:
        console.warn(message, data !== undefined ? data : '')
        break
      case LogLevel.ERROR:
        console.error(message, data !== undefined ? data : '')
        break
    }
  }
}
