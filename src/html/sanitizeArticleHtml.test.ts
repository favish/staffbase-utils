import { sanitizeArticleHtml } from './sanitizeArticleHtml'

describe('sanitizeArticleHtml', () => {
  it('strips script tags', () => {
    expect(
      sanitizeArticleHtml('<p>hi</p><script>alert(1)</script>'),
    ).not.toContain('script')
  })

  it('strips inline event handlers', () => {
    const out = sanitizeArticleHtml('<img src="x" onerror="alert(1)" />')
    expect(out).not.toContain('onerror')
  })

  it('keeps data-* attributes', () => {
    expect(sanitizeArticleHtml('<div data-widget-id="x">a</div>')).toContain(
      'data-widget-id="x"',
    )
  })

  it('keeps iframes by default', () => {
    expect(
      sanitizeArticleHtml(
        '<iframe src="https://youtube.com/embed/x"></iframe>',
      ),
    ).toContain('<iframe')
  })

  it('adds rel noopener to target=_blank anchors', () => {
    const out = sanitizeArticleHtml(
      '<a href="https://x.com" target="_blank">l</a>',
    )
    expect(out).toContain('rel="noopener noreferrer"')
  })

  it('drops iframes failing the injected predicate', () => {
    const out = sanitizeArticleHtml(
      '<iframe src="https://evil.com"></iframe>',
      {
        isAllowedIframeSrc: (src) => src.includes('youtube.com'),
      },
    )
    expect(out).not.toContain('iframe')
  })

  it('keeps iframes passing the injected predicate', () => {
    const out = sanitizeArticleHtml(
      '<iframe src="https://youtube.com/embed/x"></iframe>',
      { isAllowedIframeSrc: (src) => src.includes('youtube.com') },
    )
    expect(out).toContain('iframe')
  })

  it('keeps embedded-widget custom elements and their attributes', () => {
    const out = sanitizeArticleHtml(
      '<news-teaser data-widget-id="abc" channel-article="c|a"></news-teaser>',
    )
    expect(out).toContain('news-teaser')
    expect(out).toContain('data-widget-id="abc"')
    expect(out).toContain('channel-article="c|a"')
  })

  it('does not leak the guard to a subsequent call', () => {
    sanitizeArticleHtml('<iframe src="https://evil.com"></iframe>', {
      isAllowedIframeSrc: () => false,
    })
    // No predicate this time: iframe must be kept.
    expect(
      sanitizeArticleHtml('<iframe src="https://evil.com"></iframe>'),
    ).toContain('iframe')
  })
})
