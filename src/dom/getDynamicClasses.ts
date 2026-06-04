/**
 * Reads the host's dynamic rich-text CSS classes from the rendered article DOM.
 *
 * Staffbase applies tenant/theme-specific classes to the article body; mirroring
 * them on the widget's own rich-text container keeps typography consistent with
 * the host. Falls back to the stable default classes when the element is absent
 * or when there is no DOM (SSR/tests), so callers always get a usable string.
 * @param {string} [query] - CSS selector locating the source element.
 * @param {string} [defaultClasses] - Classes returned when the element is not found.
 * @returns {string} The host's dynamic rich-text classes, or the defaults.
 */
export const getDynamicClasses = (
  query = '.fullscreen-preview-wrapper section',
  defaultClasses = 'rich-text news-detail-post-content',
): string => {
  if (typeof document === 'undefined') return defaultClasses

  const sectionElement = document.querySelector(query)
  return sectionElement?.className || defaultClasses
}
