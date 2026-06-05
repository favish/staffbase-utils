/**
 * True when the Staffbase runtime (`window.we`) reports the platform as iOS.
 *
 * `window.we.platform` is the canonical signal exposed by the Staffbase shell,
 * so reading it directly avoids user-agent ambiguity inside the app. Returns
 * false outside the Staffbase shell or when there is no DOM.
 * @returns {boolean} True when the runtime explicitly reports iOS.
 */
export const hasIosStaffbaseRuntime = (): boolean => {
  if (typeof window === 'undefined') return false

  const we = (window as { we?: { platform?: string } }).we
  return we?.platform === 'ios'
}
