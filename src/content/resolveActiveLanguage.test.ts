import { resolveActiveLanguage } from './resolveActiveLanguage'

describe('resolveActiveLanguage', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    delete (window as { App?: unknown }).App
  })

  it('trusts contentLanguage first on the runtime path', () => {
    expect(
      resolveActiveLanguage({
        contentLanguage: 'de_DE',
        defaultLanguage: 'en_US',
      }),
    ).toBe('de_DE')
  })

  it('sniffs the preview URL when contentLanguage is absent', () => {
    ;(window as { App?: { _urlParameters?: string } }).App = {
      _urlParameters: 'language=fr_FR&x=1',
    }
    expect(resolveActiveLanguage({ defaultLanguage: 'en_US' })).toBe('fr_FR')
  })

  it('falls back to defaultLanguage when nothing resolves', () => {
    expect(resolveActiveLanguage({ defaultLanguage: 'en_US' })).toBe('en_US')
  })

  it('reads the editor tab on the editor path', () => {
    document.body.innerHTML =
      '<div aria-selected="true" data-testid="tab-lang-de_DE"></div>'
    expect(
      resolveActiveLanguage({ defaultLanguage: 'en_US', isEditor: true }),
    ).toBe('de_DE')
  })
})
