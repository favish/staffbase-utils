import { loggingState } from './loggingState'

/**
 * Logs an error only when logging is enabled. Silent by default.
 * @param {...unknown} args - Arguments forwarded to console.error.
 */
export const logError = (...args: unknown[]): void => {
  if (loggingState.enabled) console.error(...args)
}
