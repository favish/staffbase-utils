import { isSafeNavigationHref } from './isSafeNavigationHref'

describe('isSafeNavigationHref', () => {
  it('blocks scripted schemes', () => {
    expect(isSafeNavigationHref('javascript:alert(1)')).toBe(false)
    expect(isSafeNavigationHref('data:text/html,x')).toBe(false)
    expect(isSafeNavigationHref('vbscript:msgbox')).toBe(false)
  })

  it('allows http(s), relative and mailto', () => {
    expect(isSafeNavigationHref('https://example.com')).toBe(true)
    expect(isSafeNavigationHref('/articles/1')).toBe(true)
    expect(isSafeNavigationHref('mailto:a@b.com')).toBe(true)
  })

  it('rejects empty', () => {
    expect(isSafeNavigationHref('   ')).toBe(false)
  })
})
