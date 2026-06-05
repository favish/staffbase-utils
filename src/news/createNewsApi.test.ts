import { ApiError } from '../api/ApiError'
import { createNewsApi } from './createNewsApi'

const mockFetch = (impl: () => Promise<unknown>): jest.Mock => {
  const fn = jest.fn().mockImplementation(impl)
  global.fetch = fn as unknown as typeof fetch
  return fn
}

describe('createNewsApi', () => {
  const baseConfig = {
    apiUrl: 'https://example.test/api',
    defaultLanguage: 'en_US',
    getCsrfToken: () => 'token-123',
  }

  it('fetchChannels prefers default language but falls back to any localized title', async () => {
    mockFetch(async () => ({
      ok: true,
      json: async () => ({
        total: 2,
        data: [
          {
            id: 'a',
            spaceID: 's1',
            config: { localization: { en_US: { title: 'Alpha' } } },
          },
          {
            id: 'b',
            spaceID: 's2',
            config: { localization: { de_DE: { title: 'Beta' } } },
          },
        ],
      }),
    }))

    const channels = await createNewsApi(baseConfig).fetchChannels()

    expect(channels).toEqual([
      { id: 'a', title: 'Alpha', spaceId: 's1' },
      { id: 'b', title: 'Beta', spaceId: 's2' },
    ])
  })

  it('acknowledgeArticle fails fast and reports when the CSRF token is missing', async () => {
    const onError = jest.fn()
    const fetchFn = mockFetch(async () => ({ ok: true }))
    const api = createNewsApi({
      ...baseConfig,
      getCsrfToken: () => null,
      onError,
    })

    await expect(api.acknowledgeArticle('p1')).rejects.toThrow(/missing CSRF/)
    expect(fetchFn).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalled()
  })

  it('acknowledgeArticle throws a typed ApiError on a non-OK response', async () => {
    mockFetch(async () => ({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      text: async () => 'denied',
    }))

    await expect(
      createNewsApi(baseConfig).acknowledgeArticle('p1'),
    ).rejects.toBeInstanceOf(ApiError)
  })
})
