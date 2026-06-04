import { getInAppOpenLinkTarget } from './getInAppOpenLinkTarget'

const BASE = 'https://app.staffbase.com'

describe('getInAppOpenLinkTarget', () => {
  it('returns null for empty, anchors and special schemes', () => {
    expect(getInAppOpenLinkTarget('', BASE)).toBeNull()
    expect(getInAppOpenLinkTarget('#section', BASE)).toBeNull()
    expect(getInAppOpenLinkTarget('mailto:a@b.com', BASE)).toBeNull()
  })

  it('strips /deeplink/ and /openlink/ for same-origin links', () => {
    expect(getInAppOpenLinkTarget('/deeplink/news/1', BASE)).toBe(
      `${BASE}/news/1`,
    )
    expect(getInAppOpenLinkTarget('/openlink/news/2', BASE)).toBe(
      `${BASE}/news/2`,
    )
  })

  it('passes cross-origin absolute URLs through', () => {
    expect(getInAppOpenLinkTarget('https://example.com/x', BASE)).toBe(
      'https://example.com/x',
    )
  })
})
