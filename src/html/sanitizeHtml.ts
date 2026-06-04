import DOMPurify from 'dompurify'

/**
 * Strict sanitizer for untrusted snippet/teaser HTML rendered through a
 * non-sanitizing parser (e.g. html-react-parser). The default DOMPurify profile
 * strips scripts, inline handlers and dangerous URLs AND drops iframes, keeping
 * only basic rich-text markup. From global-content's sanitizeHtml.
 *
 * Use sanitizeArticleHtml instead when rendering full article bodies that must
 * keep iframes / data-* embeds.
 * @param {string} html - Raw HTML string from the API.
 * @returns {string} Sanitized HTML.
 */
export const sanitizeHtml = (html: string): string => DOMPurify.sanitize(html)
