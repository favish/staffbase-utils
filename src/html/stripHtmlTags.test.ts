import { stripHtmlTags } from './stripHtmlTags'

describe('stripHtmlTags', () => {
  it('removes tags and keeps text', () => {
    expect(stripHtmlTags('<p>Hello <b>world</b></p>')).toBe('Hello world')
  })

  it('returns empty string for undefined', () => {
    expect(stripHtmlTags(undefined)).toBe('')
  })

  it('returns empty string for empty input', () => {
    expect(stripHtmlTags('')).toBe('')
  })
})
