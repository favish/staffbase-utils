import type { WindowWithStaffbaseAuth } from '../types/host/WindowWithStaffbaseAuth'

/**
 * Reads the Staffbase CSRF token from the host's global auth manager
 * (`window.we.authMgr.getCsrfToken`).
 *
 * Returns null (instead of an empty string) when the token is unavailable, so
 * callers can fail fast with a clear message rather than firing a request the
 * server is guaranteed to reject with a 403.
 * @returns {string | null} The CSRF token, or null when it cannot be resolved.
 */
export const getStaffbaseCsrfToken = (): string | null => {
  if (typeof window === 'undefined') return null

  const w = window as unknown as WindowWithStaffbaseAuth
  const token = w?.we?.authMgr?.getCsrfToken?.()

  return token && token.length > 0 ? token : null
}
