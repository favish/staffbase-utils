/**
 * Returns true when an href is safe to pass to a real browser navigation
 * (e.g. `window.location.assign`). Blocks scripted/inline schemes that could
 * execute in the session-bearing webview. Relative URLs and http(s)/mailto/tel
 * are allowed. Promoted from staffbase-alerts.
 * @param {string} href - The href to validate.
 * @returns {boolean} True when the href is safe to navigate to.
 */
export const isSafeNavigationHref = (href: string): boolean => {
  const trimmed = href.trim().toLowerCase()
  if (!trimmed) return false

  return !(
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:')
  )
}
