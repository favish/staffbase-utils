/**
 * Warns (once per call) when the sanitizer dropped what looks like an embedded
 * widget — a custom-element tag (any hyphenated tag name). These removals are the
 * silent failure mode that makes embedded widgets "disappear" before the host can
 * render them, so surfacing them aids diagnosis. Scripts, styles and on*
 * handlers are intentionally removed and are NOT reported (they would be noise).
 * @param {readonly unknown[]} removed - DOMPurify's `removed` array after sanitize.
 * @returns {void}
 */
export const logRemovedEmbeds = (removed: readonly unknown[]): void => {
  const tags: string[] = []

  for (const entry of removed) {
    if (!entry || typeof entry !== 'object' || !('element' in entry)) continue
    const element = (entry as { element: unknown }).element
    if (element instanceof Element) {
      const tag = element.tagName.toLowerCase()
      if (tag.includes('-')) tags.push(tag)
    }
  }

  if (tags.length > 0) {
    console.warn(
      `[staffbase-utils] sanitizer removed ${tags.length} possible widget embed(s): ${tags.join(', ')} — they will not render. If these are valid embeds, the sanitizer config may need updating.`,
    )
  }
}
