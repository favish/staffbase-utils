/**
 * Reads the widget's configurable attributes off a placed element into a plain
 * map. Each name is read kebab-first with a snake_case fallback so already-saved
 * widgets (which may carry either form) read correctly. Absent attributes are
 * omitted.
 * @param {HTMLElement} element - The placed widget element.
 * @param {string[]} attributes - The attribute names to read (kebab-case).
 * @returns {Record<string, string>} The current attribute map.
 */
export const readWidgetAttributes = (
  element: HTMLElement,
  attributes: string[],
): Record<string, string> => {
  const values: Record<string, string> = {}
  for (const name of attributes) {
    const value =
      element.getAttribute(name) ??
      element.getAttribute(name.replace(/-/g, '_'))
    if (value !== null) values[name] = value
  }
  return values
}
