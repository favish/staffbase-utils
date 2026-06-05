import { normalizeLanguageCode } from './normalizeLanguageCode'

describe('normalizeLanguageCode', () => {
  it('returns an exact supported locale unchanged', () => {
    expect(normalizeLanguageCode('en_US')).toBe('en_US')
    expect(normalizeLanguageCode('ja_JP')).toBe('ja_JP')
  })

  it('converts BCP-47 separators and casing', () => {
    expect(normalizeLanguageCode('pt-BR')).toBe('pt_BR')
    expect(normalizeLanguageCode('EN_us')).toBe('en_US')
    expect(normalizeLanguageCode('de-de')).toBe('de_DE')
  })

  it('resolves a bare language to its default region', () => {
    expect(normalizeLanguageCode('en')).toBe('en_US')
    expect(normalizeLanguageCode('pt')).toBe('pt_BR')
    expect(normalizeLanguageCode('es')).toBe('es_ES')
  })

  it('falls back to the language default for an unsupported region', () => {
    expect(normalizeLanguageCode('es_AR')).toBe('es_ES')
  })

  it('returns null for unsupported or empty input', () => {
    expect(normalizeLanguageCode('xx')).toBeNull()
    expect(normalizeLanguageCode('')).toBeNull()
    expect(normalizeLanguageCode(null)).toBeNull()
    expect(normalizeLanguageCode(undefined)).toBeNull()
  })
})
