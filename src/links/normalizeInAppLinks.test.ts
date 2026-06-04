import { normalizeInAppLinks } from './normalizeInAppLinks'

const ORIGIN = 'https://app.staffbase.com'

describe('normalizeInAppLinks', () => {
  it('rewrites same-origin links to relative, marks internal, drops target', () => {
    const root = document.createElement('div')
    root.innerHTML = `<a href="${ORIGIN}/openlink/news/1" target="_blank" rel="x">l</a>`
    normalizeInAppLinks(root, ORIGIN)
    const a = root.querySelector('a')!
    expect(a.getAttribute('href')).toBe('/news/1')
    expect(a.classList.contains('internal-link')).toBe(true)
    expect(a.getAttribute('target')).toBeNull()
    expect(a.getAttribute('rel')).toBeNull()
  })

  it('hardens cross-origin target=_blank with rel=noopener', () => {
    const root = document.createElement('div')
    root.innerHTML = `<a href="https://example.com/x" target="_blank">l</a>`
    normalizeInAppLinks(root, ORIGIN)
    const a = root.querySelector('a')!
    expect(a.getAttribute('rel')).toBe('noopener noreferrer')
    expect(a.getAttribute('href')).toBe('https://example.com/x')
  })

  it('no-ops when origin is empty', () => {
    const root = document.createElement('div')
    root.innerHTML = `<a href="${ORIGIN}/openlink/news/1">l</a>`
    normalizeInAppLinks(root, '')
    expect(root.querySelector('a')!.getAttribute('href')).toBe(
      `${ORIGIN}/openlink/news/1`,
    )
  })
})
