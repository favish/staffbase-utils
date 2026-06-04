import { sanitizeHtml } from './sanitizeHtml'

describe('sanitizeHtml', () => {
  it('strips script tags', () => {
    expect(sanitizeHtml('<p>hi</p><script>alert(1)</script>')).not.toContain(
      'script',
    )
  })

  it('strips iframes (strict default profile)', () => {
    expect(
      sanitizeHtml('<iframe src="https://youtube.com/embed/x"></iframe>'),
    ).not.toContain('iframe')
  })

  it('keeps basic rich-text markup', () => {
    expect(sanitizeHtml('<p>hello <b>world</b></p>')).toContain('<b>world</b>')
  })

  it('keeps embedded-widget custom elements and their kebab/data attributes', () => {
    const out = sanitizeHtml(
      '<news-teaser data-widget-id="abc" channel-article="c|a" show-title="true"></news-teaser>',
    )
    expect(out).toContain('news-teaser')
    expect(out).toContain('data-widget-id="abc"')
    expect(out).toContain('channel-article="c|a"')
    expect(out).toContain('show-title="true"')
  })

  it('does not allow on* handlers onto custom elements', () => {
    const out = sanitizeHtml('<my-widget onload="x()" data-id="1"></my-widget>')
    expect(out).toContain('my-widget')
    expect(out).toContain('data-id="1"')
    expect(out).not.toContain('onload')
  })
})
