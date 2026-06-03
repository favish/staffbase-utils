import { isMobileOrWebview } from './isMobileOrWebview'
import { isMobileViewport } from './isMobileViewport'

/**
 * Checks if the device is mobile either by user agent/webview or viewport size.
 * @returns {boolean} True if either a mobile/webview UA or a mobile viewport.
 */
export const isMobile = (): boolean =>
  isMobileOrWebview() || isMobileViewport()
