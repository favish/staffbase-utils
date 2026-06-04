/**
 * Options for resolveLocalizedContent.
 */
export interface ResolveLocalizedContentOptions {
  /**
   * Language explicitly requested by the host/widget config. On the runtime path
   * this is trusted first so the article language matches the rest of the UI;
   * DOM/URL sniffing is only a fallback.
   */
  contentLanguage?: string
  /** Fallback language. Injected because the library never reads env. */
  defaultLanguage: string
  /** When true, resolves the active language from the editor's selected tab. */
  isEditor?: boolean
  /**
   * Called with a diagnostic message when content cannot be resolved (the
   * library does not log directly).
   * @param {string} message - The diagnostic message.
   * @param {...unknown} args - Optional extra context.
   * @returns {void} Nothing.
   */
  onError?: (message: string, ...args: unknown[]) => void
}
