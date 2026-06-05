/**
 * Generates a short, collision-resistant id safe for use as a CSS-class prefix
 * or element id.
 *
 * Prefers `crypto.randomUUID()` (first 12 hex chars) so many concurrent widget
 * instances do not share scroll-lock / focus / class-prefix keys; falls back to
 * two base36 segments when Web Crypto is unavailable (older webviews).
 * @returns {string} A unique, identifier-safe id.
 */
export const generateUniqueId = (): string => {
  const webCrypto = typeof crypto !== 'undefined' ? crypto : undefined
  if (webCrypto?.randomUUID) {
    return webCrypto.randomUUID().replace(/-/g, '').slice(0, 12)
  }

  return (
    Math.random().toString(36).slice(2, 8) +
    Math.random().toString(36).slice(2, 8)
  )
}
