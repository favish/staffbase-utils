import { isMobilePlatform } from './isMobilePlatform'
import { isNativeApp } from './isNativeApp'

const setUserAgent = (value: string): void => {
  Object.defineProperty(navigator, 'userAgent', {
    value,
    configurable: true,
  })
}

describe('isNativeApp', () => {
  afterEach(() => {
    delete (window as { we?: unknown }).we
  })

  it('is true when window.we.native is true', () => {
    ;(window as { we?: unknown }).we = { native: true }
    expect(isNativeApp()).toBe(true)
  })

  it('is false when the runtime flag is absent', () => {
    expect(isNativeApp()).toBe(false)
  })
})

describe('isMobilePlatform', () => {
  afterEach(() => {
    delete (window as { we?: unknown }).we
    setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
  })

  it('is true when window.we.mobile is true', () => {
    ;(window as { we?: unknown }).we = { mobile: true }
    setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
    expect(isMobilePlatform()).toBe(true)
  })

  it('falls back to device detection (mobile UA)', () => {
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')
    expect(isMobilePlatform()).toBe(true)
  })

  it('is false on desktop with no runtime flag', () => {
    setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
    expect(isMobilePlatform()).toBe(false)
  })
})
