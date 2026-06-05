import { isIOSTouchDevice } from './isIOSTouchDevice'

describe('isIOSTouchDevice', () => {
  const originalUA = navigator.userAgent

  const setUserAgent = (value: string): void => {
    Object.defineProperty(navigator, 'userAgent', {
      value,
      configurable: true,
    })
  }

  afterEach(() => {
    setUserAgent(originalUA)
    delete (window as { we?: unknown }).we
  })

  it('detects iOS from the user agent', () => {
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')
    expect(isIOSTouchDevice()).toBe(true)
  })

  it('detects iOS from the Staffbase runtime regardless of UA', () => {
    setUserAgent('Mozilla/5.0 (Windows NT 10.0)')
    ;(window as { we?: { platform?: string } }).we = { platform: 'ios' }
    expect(isIOSTouchDevice()).toBe(true)
  })

  it('returns false for a desktop user agent', () => {
    setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
    expect(isIOSTouchDevice()).toBe(false)
  })
})
