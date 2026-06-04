import type { WindowWithStaffbaseRuntime } from '../types/device/WindowWithStaffbaseRuntime'

/**
 * Whether the app is running inside the Staffbase native shell, per the
 * `window.we.native` runtime flag. Returns false outside a browser.
 * @returns {boolean} True when running in the native app.
 */
export const isNativeApp = (): boolean => {
  if (typeof window === 'undefined') return false

  return (window as unknown as WindowWithStaffbaseRuntime).we?.native === true
}
