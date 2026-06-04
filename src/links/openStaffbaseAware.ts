import { isSafeNavigationHref } from './isSafeNavigationHref'
import { tryOpenWithStaffbase } from './tryOpenWithStaffbase'

/**
 * Try to open with Staffbase; if not available, navigate normally in the same
 * tab. Ported from staffbase-alerts (the superset): it guards with
 * isSafeNavigationHref first, so scripted schemes never reach navigation.
 * @param {string} href - The target URL to open.
 * @returns {boolean} True if Staffbase handled the navigation, otherwise false.
 */
export const openStaffbaseAware = (href: string): boolean => {
  if (!href) return false

  // Never navigate to scripted/inline schemes (javascript:, data:, vbscript:),
  // which would execute in the session-bearing webview.
  if (!isSafeNavigationHref(href)) return false

  const result = tryOpenWithStaffbase(href)
  if (result.handled) {
    // Watchdog: if Staffbase openLink is a no-op, force navigation shortly after
    try {
      const beforeHref =
        typeof window !== 'undefined' ? window.location.href : undefined
      const timer = setTimeout(() => {
        try {
          const afterHref =
            typeof window !== 'undefined' ? window.location.href : undefined
          const visibility =
            typeof document !== 'undefined'
              ? document.visibilityState
              : undefined
          const noChange = beforeHref && afterHref && beforeHref === afterHref
          const stillVisible = visibility === 'visible'
          if (noChange && stillVisible && typeof window !== 'undefined') {
            window.location.assign(href)
          }
        } catch {
          // Ignore watchdog navigation failures.
        }
      }, 400)
      // If the Staffbase promise resolves, cancel the watchdog fallback
      try {
        result.promise
          ?.then(() => {
            clearTimeout(timer)
          })
          .catch(() => {
            // Keep the watchdog active on rejection.
          })
      } catch {
        // Ignore promise-wiring failures.
      }
    } catch {
      // Ignore watchdog setup failures.
    }
    return true
  }
  try {
    if (typeof window !== 'undefined') {
      window.location.assign(href)
    }
  } catch {
    // Ignore navigation failures.
  }
  return false
}
