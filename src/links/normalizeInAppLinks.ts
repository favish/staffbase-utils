/**
 * Normalizes links inside Staffbase-rendered HTML so they behave better in mobile
 * apps. On iOS, absolute same-origin links and/or `target="_blank"` can trigger
 * Safari instead of in-app navigation; for same-origin links we rewrite to
 * relative paths and remove target/rel. Ported from staffbase-alerts (the
 * superset): cross-origin `target="_blank"` links are hardened with
 * `rel="noopener noreferrer"` instead of left untouched. The Staffbase origin is
 * passed in (the lib never reads env).
 * @param {HTMLElement} root - The container whose anchors are normalized.
 * @param {string} staffbaseOrigin - The Staffbase origin used to detect same-origin links.
 * @returns {void}
 */
export const normalizeInAppLinks = (
  root: HTMLElement,
  staffbaseOrigin: string,
): void => {
  const origin = staffbaseOrigin?.trim() || ''
  if (!origin) return

  const anchors = Array.from(root.querySelectorAll('a[href]'))

  for (const anchor of anchors) {
    const rawHref = anchor.getAttribute('href')
    if (!rawHref) continue

    // Skip special protocols and anchors.
    const lower = rawHref.trim().toLowerCase()
    if (
      lower.startsWith('#') ||
      lower.startsWith('mailto:') ||
      lower.startsWith('tel:') ||
      lower.startsWith('sms:') ||
      lower.startsWith('javascript:') ||
      lower.startsWith('data:')
    ) {
      continue
    }

    try {
      const url = new URL(rawHref, origin)

      // Only rewrite links that point to the same Staffbase origin.
      if (url.origin !== origin) {
        // Harden cross-origin new-tab links against reverse tabnabbing rather
        // than leaving the authored target/rel untouched.
        if (anchor.getAttribute('target') === '_blank') {
          anchor.setAttribute('rel', 'noopener noreferrer')
        }
        continue
      }

      // Convert to a relative URL so the mobile app treats it as in-app navigation.
      const relative = `${url.pathname}${url.search}${url.hash}`
      const withoutStaffbasePrefix = relative
        .replace(/^\/deeplink\//, '/')
        .replace(/^\/openlink\//, '/')
      anchor.setAttribute('href', withoutStaffbasePrefix)

      // Staffbase uses this class in various contexts to mark links as internal.
      // Adding it here increases the chance that the iOS app routes the navigation in-app.
      anchor.classList.add('internal-link')

      // Avoid iOS opening Safari for "new window" navigation.
      anchor.removeAttribute('target')
      anchor.removeAttribute('rel')
    } catch {
      // If parsing fails, leave link as-is.
    }
  }
}
