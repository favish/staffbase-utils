import { isArticlePublished } from './isArticlePublished'

describe('isArticlePublished', () => {
  const iso = (offsetMs: number): string =>
    new Date(Date.now() + offsetMs).toISOString()

  it('is published when the publish date has passed and there is no unpublish', () => {
    expect(isArticlePublished({ published: iso(-1000) })).toBe(true)
  })

  it('is not published when the publish date is missing', () => {
    expect(
      isArticlePublished({ published: undefined as unknown as string }),
    ).toBe(false)
  })

  it('is not published before the publish date', () => {
    expect(isArticlePublished({ published: iso(60_000) })).toBe(false)
  })

  it('is not published once the unpublish date is reached', () => {
    expect(
      isArticlePublished({ published: iso(-60_000), unpublished: iso(-1000) }),
    ).toBe(false)
  })

  it('is published before the unpublish date', () => {
    expect(
      isArticlePublished({ published: iso(-60_000), unpublished: iso(60_000) }),
    ).toBe(true)
  })
})
