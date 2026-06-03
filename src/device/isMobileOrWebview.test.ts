import { isMobileOrWebview } from './isMobileOrWebview'

const setUserAgent = (value: string): void => {
  Object.defineProperty(navigator, 'userAgent', {
    value,
    configurable: true,
  })
}

describe('isMobileOrWebview', () => {
  it('detects a mobile platform UA', () => {
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')
    expect(isMobileOrWebview()).toBe(true)
  })

  it('detects a webview UA', () => {
    setUserAgent('Mozilla/5.0 (Linux; Android 13; wv) AppleWebKit/537.36')
    expect(isMobileOrWebview()).toBe(true)
  })

  it('returns false for a desktop UA', () => {
    setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
    expect(isMobileOrWebview()).toBe(false)
  })
})
