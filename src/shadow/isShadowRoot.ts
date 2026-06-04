/**
 * Type guard for a real ShadowRoot, used to ensure style injection never targets
 * `document.head`/`document.body` (which would break Shadow DOM style isolation).
 * @param {unknown} value - The candidate value.
 * @returns {boolean} True when the value is a ShadowRoot.
 */
export const isShadowRoot = (value: unknown): value is ShadowRoot => {
  if (!value || typeof value !== 'object') return false

  const nodeType = (value as Node).nodeType
  return (
    nodeType === Node.DOCUMENT_FRAGMENT_NODE &&
    'host' in value &&
    'mode' in value
  )
}
