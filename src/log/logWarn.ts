import { loggingState } from './loggingState'

/**
 * Logs a warning only when logging is enabled. Silent by default.
 * @param {...unknown} args - Arguments forwarded to console.warn.
 */
export const logWarn = (...args: unknown[]): void => {
  if (loggingState.enabled) console.warn(...args)
}
