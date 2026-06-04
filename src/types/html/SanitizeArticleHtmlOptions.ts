/**
 * Options for sanitizeArticleHtml.
 */
export interface SanitizeArticleHtmlOptions {
  /**
   * Predicate deciding whether an iframe `src` may be kept. When provided,
   * iframes whose src fails the predicate are dropped. When omitted, iframes are
   * kept (DOMPurify still blocks `src="javascript:"`). Injected so the /html
   * module does not depend on /links, which owns isAllowedIframeSrc.
   * @param {string} src - The iframe src attribute value.
   * @returns {boolean} True when the iframe may be kept.
   */
  isAllowedIframeSrc?: (src: string) => boolean
}
