import type { LocalizedContent } from '../types/content/LocalizedContent'
import { resolveLocalizedContent } from './resolveLocalizedContent'

const make = (over: Partial<LocalizedContent>): LocalizedContent => ({
  title: '',
  teaser: '',
  content: '',
  image: null,
  feedImage: null,
  ...over,
})

describe('resolveLocalizedContent', () => {
  it('returns null and reports when contents are missing', () => {
    const onError = jest.fn()
    expect(
      resolveLocalizedContent(undefined, { defaultLanguage: 'en_US', onError }),
    ).toBeNull()
    expect(onError).toHaveBeenCalled()
  })

  it('picks the requested language', () => {
    const contents = {
      en_US: make({ title: 'Hello' }),
      de_DE: make({ title: 'Hallo' }),
    }
    const result = resolveLocalizedContent(contents, {
      contentLanguage: 'de_DE',
      defaultLanguage: 'en_US',
    })
    expect(result?.title).toBe('Hallo')
  })

  it('field-merges from the default language when a field is empty', () => {
    const contents = {
      en_US: make({ title: 'Hello', teaser: 'EN teaser' }),
      de_DE: make({ title: 'Hallo' }), // teaser empty -> falls back to en_US
    }
    const result = resolveLocalizedContent(contents, {
      contentLanguage: 'de_DE',
      defaultLanguage: 'en_US',
    })
    expect(result).toEqual({
      title: 'Hallo',
      teaser: 'EN teaser',
      content: '',
      image: '',
      feedImage: '',
    })
  })

  it('falls back to the default language when the requested one is absent', () => {
    const contents = { en_US: make({ title: 'Hello' }) }
    const result = resolveLocalizedContent(contents, {
      contentLanguage: 'fr_FR',
      defaultLanguage: 'en_US',
    })
    expect(result?.title).toBe('Hello')
  })

  it('returns null and reports when no language matches', () => {
    const onError = jest.fn()
    const result = resolveLocalizedContent(
      { de_DE: make({ title: 'Hallo' }) },
      { contentLanguage: 'fr_FR', defaultLanguage: 'en_US', onError },
    )
    expect(result).toBeNull()
    expect(onError).toHaveBeenCalled()
  })
})
