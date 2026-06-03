import { loggingState } from './loggingState'

/**
 * Enable or disable console diagnostics for all log helpers.
 * @param {boolean} enabled - True to print, false to silence.
 */
export const setLoggingEnabled = (enabled: boolean): void => {
  loggingState.enabled = enabled
}
