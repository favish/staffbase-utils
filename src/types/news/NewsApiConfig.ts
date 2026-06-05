/**
 * Configuration for the news service factory (createNewsApi).
 *
 * Everything environment-specific is injected here so the service stays pure
 * and host-agnostic - the library never reads `process.env`, a CSRF cookie, or
 * a global default language on its own.
 */
export interface NewsApiConfig {
  /** Base Staffbase API URL, without a trailing slash (e.g. `https://app.staffbase.com/api`). */
  apiUrl: string
  /**
   * Preferred locale for channel titles. The resolver still falls back to any
   * available localized title, so a channel localized only in another language
   * is never dropped from a selector.
   */
  defaultLanguage: string
  /**
   * Supplies the Staffbase CSRF token for write requests (acknowledgement).
   * Defaults to the platform host token when omitted.
   * @returns {string | null} The current CSRF token, or null when unavailable.
   */
  getCsrfToken?: () => string | null
  /**
   * Receives diagnostics (pagination truncation, acknowledgement failures).
   * Injected because the library does not log directly.
   * @param {string} message - The diagnostic message.
   * @param {...unknown} args - Optional extra context.
   * @returns {void} Nothing.
   */
  onError?: (message: string, ...args: unknown[]) => void
  /**
   * Hard cap on pages fetched per collection. Lower it (e.g. 20) to bound
   * first-paint latency on very large channels; omit for the library default.
   */
  maxPages?: number
}
