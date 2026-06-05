/**
 * Backfills canonical kebab-case widget attributes from their legacy
 * snake_case spelling.
 *
 * For each canonical name (e.g. `article-id`), if it is absent or blank but the
 * snake_case form (`article_id`) carries a value, the value is copied onto the
 * canonical attribute. Lets a widget migrate its attribute naming without
 * breaking embeds that still use the old names. Mutates `element` in place.
 * @param {Element} element - The custom element to normalize.
 * @param {readonly string[]} canonicalNames - The canonical kebab-case attribute names.
 * @returns {void} Nothing.
 */
export const normalizeLegacyAttributes = (
  element: Element,
  canonicalNames: readonly string[],
): void => {
  for (const canonical of canonicalNames) {
    const legacy = canonical.replace(/-/g, '_')
    if (legacy === canonical) continue

    const canonicalValue = element.getAttribute(canonical)
    const legacyValue = element.getAttribute(legacy)

    if (
      (canonicalValue === null || canonicalValue === '') &&
      legacyValue !== null &&
      legacyValue !== ''
    ) {
      element.setAttribute(canonical, legacyValue)
    }
  }
}
