import { resolveSupportedLanguage } from './resolveSupportedLanguage'

describe('resolveSupportedLanguage', () => {
  it('returns the normalized requested locale when no available set is given', () => {
    expect(
      resolveSupportedLanguage({ requested: 'de-DE', defaultLocale: 'en_US' }),
    ).toBe('de_DE')
  })

  it('falls back to the default when requested is unsupported', () => {
    expect(
      resolveSupportedLanguage({ requested: 'xx', defaultLocale: 'en_US' }),
    ).toBe('en_US')
  })

  it('prefers an exact match within the available set', () => {
    expect(
      resolveSupportedLanguage({
        requested: 'fr_FR',
        available: ['en_US', 'fr_FR', 'de_DE'],
        defaultLocale: 'en_US',
      }),
    ).toBe('fr_FR')
  })

  it('falls back to a same-language available locale', () => {
    expect(
      resolveSupportedLanguage({
        requested: 'pt_PT',
        available: ['en_US', 'pt_BR'],
        defaultLocale: 'en_US',
      }),
    ).toBe('pt_BR')
  })

  it('uses the default locale when present but requested is absent', () => {
    expect(
      resolveSupportedLanguage({
        requested: 'ja_JP',
        available: ['en_US', 'de_DE'],
        defaultLocale: 'de_DE',
      }),
    ).toBe('de_DE')
  })

  it('uses the first available locale when neither requested nor default is present', () => {
    expect(
      resolveSupportedLanguage({
        requested: 'ja_JP',
        available: ['fr_FR', 'it_IT'],
        defaultLocale: 'en_US',
      }),
    ).toBe('fr_FR')
  })
})
