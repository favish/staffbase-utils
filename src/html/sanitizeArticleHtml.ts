import createDOMPurify from 'dompurify'

import type { SanitizeArticleHtmlOptions } from '../types/html/SanitizeArticleHtmlOptions'

// Dedicated DOMPurify instance so the hardening hook below is scoped to this
// sanitizer and never pollutes the consumer's shared default DOMPurify instance
// (other code may sanitize through the default instance directly).
const purifier = createDOMPurify(window)

// Set synchronously around each (synchronous) sanitize call. JS is
// single-threaded, so the guard cannot leak across calls.
let activeIframeGuard: ((src: string) => boolean) | null = null

// afterSanitizeAttributes hook: force rel="noopener noreferrer" on
// target="_blank" anchors (reverse-tabnabbing), and drop iframes whose src fails
// the injected allowlist predicate when one is active.
purifier.addHook('afterSanitizeAttributes', (node) => {
  if (!(node instanceof Element)) return

  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer')
  }

  if (node.tagName === 'IFRAME' && activeIframeGuard) {
    const src = node.getAttribute('src') ?? ''
    if (!activeIframeGuard(src)) node.parentNode?.removeChild(node)
  }
})

/**
 * Canonical sanitizer for rich article HTML rendered into a session-bearing
 * webview. Superset of the alerts and unacknowledged-bulletins variants: keeps
 * iframes and data-* attributes (renderWidgets discovers embedded sub-widgets via
 * data-*), strips scripts/inline handlers/javascript:, and forces
 * rel="noopener noreferrer" on target="_blank" anchors. When options.isAllowedIframeSrc
 * is provided, iframes whose src fails it are dropped (injected so this module
 * does not depend on /links, which owns isAllowedIframeSrc).
 * @param {string} html - Raw article HTML from the Staffbase API.
 * @param {SanitizeArticleHtmlOptions} options - Optional iframe-src allowlist.
 * @returns {string} Sanitized HTML safe to inject/parse.
 */
export const sanitizeArticleHtml = (
  html: string,
  options: SanitizeArticleHtmlOptions = {},
): string => {
  activeIframeGuard = options.isAllowedIframeSrc ?? null
  try {
    return purifier.sanitize(html, {
      USE_PROFILES: { html: true },
      ADD_TAGS: ['iframe'],
      ADD_ATTR: [
        'target',
        'allow',
        'allowfullscreen',
        'frameborder',
        'scrolling',
        'loading',
        'referrerpolicy',
      ],
      FORBID_TAGS: ['script', 'style'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick'],
    })
  } finally {
    activeIframeGuard = null
  }
}
