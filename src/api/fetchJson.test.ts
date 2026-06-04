import { ApiError } from './ApiError'
import { fetchJson } from './fetchJson'

describe('fetchJson', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns parsed JSON on a 2xx response', async () => {
    const json = { hello: 'world' }
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(json),
    }) as unknown as typeof fetch

    await expect(fetchJson<typeof json>('https://x/api')).resolves.toEqual(json)
    expect(global.fetch).toHaveBeenCalledWith('https://x/api', {
      credentials: 'include',
    })
  })

  it('throws ApiError carrying the status on a non-2xx response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 403,
    }) as unknown as typeof fetch

    await expect(fetchJson('https://x/api')).rejects.toMatchObject({
      name: 'ApiError',
      status: 403,
    })
    await expect(fetchJson('https://x/api')).rejects.toBeInstanceOf(ApiError)
  })
})
