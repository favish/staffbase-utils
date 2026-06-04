import DOMPurify from 'dompurify'

import { customElementHandling } from './customElementHandling'

/**
 * Strict sanitizer for untrusted snippet/teaser HTML rendered through a
 * non-sanitizing parser (e.g. html-react-parser). The default DOMPurify profile
 * strips scripts, inline handlers and dangerous URLs AND drops iframes, keeping
 * only basic rich-text markup. Embedded-widget custom elements (and their
 * kebab/data attributes) are preserved so the host can hydrate them. From
 * global-content's sanitizeHtml.
 *
 * Use sanitizeArticleHtml instead when rendering full article bodies that must
 * keep iframes / data-* embeds.
 * @param {string} html - Raw HTML string from the API.
 * @returns {string} Sanitized HTML.
 */
export const sanitizeHtml = (html: string): string =>
  DOMPurify.sanitize(html, { CUSTOM_ELEMENT_HANDLING: customElementHandling })
