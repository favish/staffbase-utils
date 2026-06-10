/**
 * Writes an edited attribute map back onto a placed widget element as kebab-case
 * attributes, removing the legacy snake_case twin of each so the saved tag stays
 * canonical and tinymce serializes a single clean form.
 * @param {HTMLElement} element - The widget element to update.
 * @param {Record<string, string>} values - The edited attribute map (kebab keys).
 * @returns {void}
 */
export const writeWidgetAttributes = (
  element: HTMLElement,
  values: Record<string, string>,
): void => {
  for (const [name, value] of Object.entries(values)) {
    element.removeAttribute(name.replace(/-/g, '_'))
    element.setAttribute(name, value)
  }
}
