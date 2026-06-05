/**
 * Reports whether `window.localStorage` is usable in the current environment.
 *
 * Access can throw (sandboxed iframes, disabled storage, SSR), so the probe is
 * wrapped in try/catch and treats any failure as unavailable.
 * @returns {boolean} True when localStorage can be read and written.
 */
export const canUseLocalStorage = (): boolean => {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    )
  } catch {
    return false
  }
}
