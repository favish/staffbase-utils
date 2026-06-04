/**
 * Returns the shadow-root `<meta name="emotion-insertion-point">` with the given
 * id, creating it if absent. Keeps Emotion's styles ordered before shadow content.
 * @param {ShadowRoot} root - The shadow root to search/append within.
 * @param {string} id - The element id.
 * @returns {HTMLMetaElement} The existing or newly created insertion-point meta.
 */
export const getOrCreateEmotionInsertionPoint = (
  root: ShadowRoot,
  id: string,
): HTMLMetaElement => {
  const existing = root.getElementById(id)
  if (existing instanceof HTMLMetaElement) return existing

  const el = document.createElement('meta')
  el.id = id
  el.setAttribute('name', 'emotion-insertion-point')
  root.appendChild(el)
  return el
}
