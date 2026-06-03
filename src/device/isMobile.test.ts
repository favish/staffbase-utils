import { isMobile } from './isMobile'

const setUserAgent = (value: string): void => {
  Object.defineProperty(navigator, 'userAgent', {
    value,
    configurable: true,
  })
}

const setInnerWidth = (value: number): void => {
  Object.defineProperty(window, 'innerWidth', {
    value,
    configurable: true,
  })
}

describe('isMobile', () => {
  it('is true when the UA is mobile even on a wide viewport', () => {
    setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')
    setInnerWidth(1280)
    expect(isMobile()).toBe(true)
  })

  it('is true when the viewport is narrow even on a desktop UA', () => {
    setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
    setInnerWidth(480)
    expect(isMobile()).toBe(true)
  })

  it('is false on a desktop UA with a wide viewport', () => {
    setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
    setInnerWidth(1280)
    expect(isMobile()).toBe(false)
  })
})
