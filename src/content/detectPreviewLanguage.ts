/**
 * Reads the `language` URL parameter the Staffbase preview shell exposes on
 * `window.App._urlParameters`. Returns null when the shell or parameter is
 * absent (or there is no DOM), so callers can fall back.
 * @returns {string | null} The preview language, or null.
 */
export const detectPreviewLanguage = (): string | null => {
  if (typeof window === 'undefined') return null

  const appConfig = (window as { App?: { _urlParameters?: string } }).App
    ?._urlParameters
  if (!appConfig) return null

  return new URLSearchParams(appConfig).get('language')
}
