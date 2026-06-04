/**
 * Returns the shadow-root child `<div>` with the given id, creating it if absent.
 * @param {ShadowRoot} root - The shadow root to search/append within.
 * @param {string} id - The element id.
 * @returns {HTMLDivElement} The existing or newly created div.
 */
export const getOrCreateDiv = (
  root: ShadowRoot,
  id: string,
): HTMLDivElement => {
  const existing = root.getElementById(id)
  if (existing instanceof HTMLDivElement) return existing

  const el = document.createElement('div')
  el.id = id
  root.appendChild(el)
  return el
}
