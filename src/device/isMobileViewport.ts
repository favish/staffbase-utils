/**
 * Checks if the viewport width is mobile-sized (<= 768px).
 * Guards against non-browser environments (SSR/tests without window).
 * @returns {boolean} True if the viewport width is 768px or less.
 */
export const isMobileViewport = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= 768
}
