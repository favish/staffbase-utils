import { stripStaffbaseLinkPrefix } from './stripStaffbaseLinkPrefix'

/**
 * Returns an absolute URL string that is safe to pass into Staffbase's
 * `openLink()`. We intentionally do NOT require `/openlink/`; if the platform
 * strips it, links can still open in-app by delegating to `openLink()`. Ported
 * from staffbase-alerts (identical to unack).
 * @param {string | null | undefined} href - Raw href as found on an <a> element.
 * @param {string} baseUrl - Base URL used to resolve relative hrefs (usually window.location.origin).
 * @returns {string | null} An absolute URL string, or null if it should not be handled.
 */
export const getInAppOpenLinkTarget = (
  href: string | null | undefined,
  baseUrl: string,
): string | null => {
  const trimmed = href?.trim()
  if (!trimmed) return null

  // Ignore anchors and non-navigational links.
  if (trimmed.startsWith('#')) return null

  // Let the browser handle special protocols.
  const lower = trimmed.toLowerCase()
  if (
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    lower.startsWith('sms:') ||
    lower.startsWith('javascript:') ||
    lower.startsWith('data:')
  ) {
    return null
  }

  try {
    const base = new URL(baseUrl)
    const url = new URL(trimmed, base.toString())

    // Canonicalize same-origin links by stripping Staffbase prefixes, but keep them absolute.
    if (url.origin === base.origin) {
      const cleanedPath = stripStaffbaseLinkPrefix(url.pathname)
      const absolute = new URL(
        `${cleanedPath}${url.search}${url.hash}`,
        base.origin,
      )
      return absolute.toString()
    }

    // For cross-origin absolute URLs, return as-is.
    return url.toString()
  } catch {
    return null
  }
}
