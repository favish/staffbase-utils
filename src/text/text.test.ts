import { normalizeText } from './normalizeText'
import { normalizeTextForSearch } from './normalizeTextForSearch'
import { truncateText } from './truncateText'

describe('truncateText', () => {
  it('returns short text unchanged', () => {
    expect(truncateText('hi', 10)).toBe('hi')
  })

  it('truncates with an ellipsis within the limit', () => {
    const result = truncateText('abcdefghij', 5)
    expect(result).toHaveLength(5)
    expect(result.endsWith('…')).toBe(true)
  })

  it('returns empty string for nullish input', () => {
    expect(truncateText(undefined, 5)).toBe('')
  })
})

describe('normalizeText', () => {
  it('lowercases, trims and collapses whitespace', () => {
    expect(normalizeText('  Hello\tWorld  ')).toBe('hello world')
  })

  it('strips zero-width characters', () => {
    const zwsp = String.fromCharCode(0x200b)
    expect(normalizeText(`a${zwsp}b`)).toBe('ab')
  })

  it('collapses a non-breaking space', () => {
    const nbsp = String.fromCharCode(0x00a0)
    expect(normalizeText(`a${nbsp}b`)).toBe('a b')
  })
})

describe('normalizeTextForSearch', () => {
  it('strips tags, punctuation and normalizes', () => {
    expect(normalizeTextForSearch('<p>Alpha-Beta!</p>')).toBe('alpha beta')
  })
})
