import type { TryOpenResult } from '../types/links/TryOpenResult'
import type { WindowWithStaffbase } from '../types/links/WindowWithStaffbase'

import { isPromiseLike } from './isPromiseLike'

/**
 * Attempt to open a link using Staffbase's plugin util.openLink if available.
 * Ported from staffbase-alerts (typed Promise-like guard; smart-search used
 * `as any`).
 * @param {string} href - The target URL to open.
 * @returns {TryOpenResult} Whether Staffbase handled it and a promise if available.
 */
export const tryOpenWithStaffbase = (href: string): TryOpenResult => {
  try {
    if (typeof window === 'undefined') {
      return { handled: false }
    }
    const w = window as WindowWithStaffbase
    const open = w?.staffbase?.plugin?.util?.openLink
    const hasOpenLink = typeof open === 'function'
    if (!hasOpenLink) return { handled: false }
    // Pass empty options as the second parameter to align with openLink signature
    const maybePromise = open(href, {})
    // If a Promise is returned, normalize it
    let normalizedPromise: Promise<void> | undefined
    if (maybePromise && isPromiseLike(maybePromise)) {
      normalizedPromise = maybePromise as Promise<void>
    }
    return { handled: true, promise: normalizedPromise }
  } catch {
    return { handled: false }
  }
}
