import { loggingState } from './loggingState'

/**
 * Logs a debug message only when logging is enabled. Silent by default.
 * @param {...unknown} args - Arguments forwarded to console.log.
 */
export const logDebug = (...args: unknown[]): void => {
  // eslint-disable-next-line no-console
  if (loggingState.enabled) console.log(...args)
}
