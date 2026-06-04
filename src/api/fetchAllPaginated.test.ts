import { fetchAllPaginated } from './fetchAllPaginated'

const mockPages = (pages: { data: unknown[]; total?: number }[]): void => {
  const fn = jest.fn()
  pages.forEach((page) =>
    fn.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(page) }),
  )
  // Any extra calls resolve to an empty page so the loop terminates safely.
  fn.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
  })
  global.fetch = fn as unknown as typeof fetch
}

describe('fetchAllPaginated', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('concatenates pages and stops on a short page', async () => {
    mockPages([
      { data: [1, 2], total: 3 },
      { data: [3] }, // short page (< limit) ends the loop
    ])

    const result = await fetchAllPaginated<number>('https://x/items', {
      limit: 2,
    })
    expect(result).toEqual([1, 2, 3])
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })

  it('applies mapItem and drops nulls', async () => {
    mockPages([{ data: [{ id: 'a' }, { id: '' }] }])

    const result = await fetchAllPaginated<string, { id: string }>(
      'https://x/items',
      { limit: 2, mapItem: (i) => (i.id ? i.id : null) },
    )
    expect(result).toEqual(['a'])
  })

  it('appends includeDrafts when requested', async () => {
    mockPages([{ data: [1] }])
    await fetchAllPaginated<number>('https://x/items', {
      limit: 50,
      includeDrafts: true,
    })
    expect(global.fetch).toHaveBeenCalledWith(
      'https://x/items?limit=50&offset=0&includeDrafts=true',
      { credentials: 'include' },
    )
  })

  it('invokes onError when the maxPages cap is hit', async () => {
    // Every page is full (length === limit) so the loop only stops at the cap.
    mockPages([{ data: [1, 2] }, { data: [3, 4] }, { data: [5, 6] }])
    const onError = jest.fn()
    const result = await fetchAllPaginated<number>('https://x/items', {
      limit: 2,
      maxPages: 2,
      onError,
    })
    expect(result).toEqual([1, 2, 3, 4])
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError.mock.calls[0][0]).toContain('Pagination cap (2 pages)')
  })
})
