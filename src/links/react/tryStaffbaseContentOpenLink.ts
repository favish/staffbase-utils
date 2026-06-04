import type { NativeLinkEvent } from '../../types/links/NativeLinkEvent'
import type { StaffbaseContentWindow } from '../../types/links/StaffbaseContentWindow'

/**
 * Tries the host's own content open-link helper (the one Staffbase's widget
 * manager uses), to stay maximally aligned with platform behavior. Returns false
 * when the helper is absent or throws, so the caller can fall back.
 * @param {NativeLinkEvent} e - The originating native event.
 * @returns {boolean} True when the host helper handled the open.
 */
export const tryStaffbaseContentOpenLink = (e: NativeLinkEvent): boolean => {
  const staffbase = (window as unknown as StaffbaseContentWindow).staffbase
  const fn =
    staffbase?.content?.link?.openLink ||
    staffbase?.content?.links?.openLink ||
    staffbase?.content?.loader?.link?.openLink

  if (typeof fn !== 'function') return false

  try {
    fn({ useDefault: false }, e)
    return true
  } catch {
    // The host helper is best-effort; fall back to standard navigation on error.
    return false
  }
}
