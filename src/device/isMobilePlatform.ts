import type { WindowWithStaffbaseRuntime } from '../types/device/WindowWithStaffbaseRuntime'
import { isMobile } from './isMobile'

/**
 * Whether the app is running on a mobile platform, per the `window.we.mobile`
 * runtime flag or device detection. Returns false outside a browser.
 * @returns {boolean} True when running on a mobile platform.
 */
export const isMobilePlatform = (): boolean => {
  if (typeof window === 'undefined') return false

  return (
    (window as unknown as WindowWithStaffbaseRuntime).we?.mobile === true ||
    isMobile()
  )
}
