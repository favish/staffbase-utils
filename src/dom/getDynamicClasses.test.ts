import { getDynamicClasses } from './getDynamicClasses'

describe('getDynamicClasses', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('returns the matched element className', () => {
    document.body.innerHTML =
      '<div class="fullscreen-preview-wrapper"><section class="rich-text custom-theme"></section></div>'
    expect(getDynamicClasses()).toBe('rich-text custom-theme')
  })

  it('falls back to the default classes when no element matches', () => {
    expect(getDynamicClasses()).toBe('rich-text news-detail-post-content')
  })

  it('falls back when the matched element has no className', () => {
    document.body.innerHTML =
      '<div class="fullscreen-preview-wrapper"><section></section></div>'
    expect(getDynamicClasses()).toBe('rich-text news-detail-post-content')
  })

  it('honors a custom selector and default', () => {
    document.body.innerHTML = '<article class="themed-body"></article>'
    expect(getDynamicClasses('article.themed-body', 'fallback')).toBe(
      'themed-body',
    )
    expect(getDynamicClasses('.missing', 'fallback')).toBe('fallback')
  })
})
