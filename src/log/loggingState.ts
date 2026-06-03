/**
 * Module-private on/off switch for console diagnostics. Default false keeps
 * production silent. Consumers flip it via setLoggingEnabled at startup so the
 * library never reads the host environment flags directly (webview-safe).
 */
export const loggingState: { enabled: boolean } = { enabled: false }
