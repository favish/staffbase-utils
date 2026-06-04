// Hosts allowed to be framed inside sanitized article content. Article HTML is
// first-party authored in Staffbase, but it renders inside a session-bearing
// webview, so iframe sources are constrained to known embed providers plus the
// Staffbase origin rather than allowing arbitrary framing. Promoted from
// staffbase-alerts.
const ALLOWED_IFRAME_HOST_SUFFIXES = [
  'youtube.com',
  'youtube-nocookie.com',
  'youtu.be',
  'vimeo.com',
  'player.vimeo.com',
  'staffbase.com',
  'staffbase.rocks',
]

/**
 * Returns true when an iframe src may be rendered. Same-origin sources are
 * always allowed; cross-origin sources must match the embed allowlist. Pair with
 * sanitizeArticleHtml's `isAllowedIframeSrc` option.
 * @param {string} src - The iframe src attribute value.
 * @returns {boolean} True when the iframe may be kept.
 */
export const isAllowedIframeSrc = (src: string): boolean => {
  const trimmed = src.trim()
  if (!trimmed) return false

  try {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://localhost'
    const url = new URL(trimmed, origin)

    if (url.protocol !== 'https:' && url.protocol !== 'http:') return false
    if (url.origin === origin) return true

    const host = url.hostname.toLowerCase()
    return ALLOWED_IFRAME_HOST_SUFFIXES.some(
      (suffix) => host === suffix || host.endsWith(`.${suffix}`),
    )
  } catch {
    return false
  }
}
