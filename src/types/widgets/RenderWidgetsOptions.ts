/**
 * Options for renderWidgets.
 */
export interface RenderWidgetsOptions {
  /** Maximum render attempts before giving up. Default 10. */
  maxRetries?: number
  /** Delay between attempts, in milliseconds. Default 300. */
  retryDelay?: number
  /**
   * Called when an error is swallowed. `context` labels where it happened
   * (e.g. 'manager-unavailable', 'extract', 'render-widget'). Default: warn on
   * critical context only.
   */
  onError?: (error: unknown, context: string) => void
  /**
   * Token used to dedupe/cancel repeated renders. A newer render with the same
   * key cancels older in-flight/queued ones. Default: the container element.
   */
  cancelKey?: object
}
