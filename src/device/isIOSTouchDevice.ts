import { hasIosStaffbaseRuntime } from './hasIosStaffbaseRuntime'

/**
 * Returns true when running on an iOS touch device (iPhone / iPad / iPod).
 *
 * Detection order: (1) the Staffbase runtime platform flag (authoritative
 * inside the shell), (2) legacy iOS user-agent (webviews and older Safari),
 * (3) iPadOS 13+ which reports a macOS user-agent but exposes multi-touch.
 * @returns {boolean} Whether the current device is iOS with touch.
 */
export const isIOSTouchDevice = (): boolean => {
  if (hasIosStaffbaseRuntime()) return true
  if (typeof navigator === 'undefined') return false

  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/.test(ua)) return true

  // iPadOS desktop mode: UA says "Macintosh" but touch is available.
  return /Macintosh/.test(ua) && navigator.maxTouchPoints > 1
}
