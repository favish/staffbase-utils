import DOMPurify from 'dompurify'

/**
 * Strips all HTML tags, keeping the text content. From smart-search's
 * stripHtmlTags; its html-react-parser fallback is intentionally dropped to
 * avoid a heavy runtime dependency — the DOMPurify path plus a regex fallback is
 * sufficient and never throws in practice.
 * @param {string | undefined} html - String that may contain HTML tags.
 * @returns {string} The text content with tags removed.
 */
export const stripHtmlTags = (html?: string): string => {
  if (!html) return ''

  try {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: [], KEEP_CONTENT: true })
  } catch {
    return html.replace(/<\/?[^>]+(>|$)/g, '')
  }
}
