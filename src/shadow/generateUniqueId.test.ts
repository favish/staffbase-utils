import { generateUniqueId } from './generateUniqueId'

describe('generateUniqueId', () => {
  it('returns a non-empty identifier-safe string', () => {
    const id = generateUniqueId()
    expect(id.length).toBeGreaterThan(0)
    expect(id).toMatch(/^[a-z0-9]+$/i)
  })

  it('returns distinct ids across calls', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateUniqueId()))
    expect(ids.size).toBe(100)
  })
})
