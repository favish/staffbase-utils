import { cleanHTML } from './cleanHTML'

describe('cleanHTML', () => {
  it('strips tags, lowercases and removes punctuation', () => {
    expect(cleanHTML('<h1>Hello, World!</h1>')).toBe('hello world')
  })

  it('collapses whitespace', () => {
    expect(cleanHTML('<p>a   b</p>')).toBe('a b')
  })

  it('returns empty string for empty input', () => {
    expect(cleanHTML('')).toBe('')
  })
})
