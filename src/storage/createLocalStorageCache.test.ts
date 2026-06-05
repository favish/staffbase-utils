import { createLocalStorageCache } from './createLocalStorageCache'

describe('createLocalStorageCache', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('round-trips a value within the TTL', () => {
    const cache = createLocalStorageCache<string[]>('k', 60_000)
    cache.write(['a', 'b'])
    expect(cache.read()).toEqual(['a', 'b'])
  })

  it('returns null once the entry has expired', () => {
    const cache = createLocalStorageCache<number>('k', -1)
    cache.write(1)
    expect(cache.read()).toBeNull()
  })

  it('returns null for a malformed entry', () => {
    window.localStorage.setItem('k', 'not json')
    expect(createLocalStorageCache('k', 60_000).read()).toBeNull()
  })

  it('clear removes the entry', () => {
    const cache = createLocalStorageCache<string>('k', 60_000)
    cache.write('x')
    cache.clear()
    expect(cache.read()).toBeNull()
  })
})
