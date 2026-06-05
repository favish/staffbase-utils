/**
 * Resolves the deepest focused element across nested shadow roots.
 *
 * `document.activeElement` only reports the focused node in the top-level
 * document; when focus lives inside a shadow tree it returns that tree's HOST,
 * not the actual focused element. Widgets that render into a ShadowRoot almost
 * never want the raw value. Walking `activeElement.shadowRoot.activeElement`
 * recovers the real target.
 * @returns {HTMLElement | null} The innermost focused element, or null.
 */
export const getDeepActiveElement = (): HTMLElement | null => {
  if (typeof document === 'undefined') return null

  let active: Element | null = document.activeElement
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement
  }

  return (active as HTMLElement | null) ?? null
}
