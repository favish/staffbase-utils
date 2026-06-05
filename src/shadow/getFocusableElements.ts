/**
 * Returns the focusable elements inside a container, in DOM order.
 *
 * Matches the common interactive selectors (links, enabled form controls, and
 * anything with a non-negative tabindex) and filters out disabled or
 * `tabindex="-1"` nodes. Useful for focus trapping inside dialogs/drawers.
 * @param {HTMLElement} container - The container to search.
 * @returns {HTMLElement[]} Focusable elements in document order.
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',')

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1,
  )
}
