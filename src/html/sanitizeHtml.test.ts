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
})
