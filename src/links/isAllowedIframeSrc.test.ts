import { isAllowedIframeSrc } from './isAllowedIframeSrc'

describe('isAllowedIframeSrc', () => {
  it('allows known embed providers', () => {
    expect(isAllowedIframeSrc('https://www.youtube.com/embed/x')).toBe(true)
    expect(isAllowedIframeSrc('https://player.vimeo.com/video/1')).toBe(true)
    expect(isAllowedIframeSrc('https://app.staffbase.com/x')).toBe(true)
  })

  it('allows same-origin sources', () => {
    expect(isAllowedIframeSrc(`${window.location.origin}/embed`)).toBe(true)
  })

  it('rejects unknown hosts and non-http(s) schemes', () => {
    expect(isAllowedIframeSrc('https://evil.com/x')).toBe(false)
    expect(isAllowedIframeSrc('javascript:alert(1)')).toBe(false)
    expect(isAllowedIframeSrc('   ')).toBe(false)
  })
})
