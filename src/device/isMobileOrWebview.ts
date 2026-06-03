/**
 * Detects if the current environment is a mobile device or running inside a
 * webview, using userAgent heuristics common on iOS/Android and webviews.
 * Guards against non-browser environments (SSR/tests without navigator).
 * @returns {boolean} True if likely mobile or webview.
 */
export const isMobileOrWebview = (): boolean => {
  if (typeof navigator === 'undefined') return false

  const userAgent = navigator.userAgent.toLowerCase()
  const isMobilePlatform =
    /mobile|android|ios|iphone|ipad|ipod|windows phone/i.test(userAgent)
  const isWebview = /wv|webview/i.test(userAgent)

  return isMobilePlatform || isWebview
}
