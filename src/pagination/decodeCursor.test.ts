import { decodeCursor } from './decodeCursor'

const encode = (value: unknown): string => btoa(JSON.stringify(value))

describe('decodeCursor', () => {
  it('decodes a valid cursor token', () => {
    const token = encode({ id: 'abc', createdAt: '2026-01-01T00:00:00Z' })
    expect(decodeCursor(token)).toEqual({
      id: 'abc',
      createdAt: '2026-01-01T00:00:00Z',
    })
  })

  it('coerces non-string id/createdAt to strings', () => {
    const token = encode({ id: 42, createdAt: 1234 })
    expect(decodeCursor(token)).toEqual({ id: '42', createdAt: '1234' })
  })

  it('returns null for missing input', () => {
    expect(decodeCursor(null)).toBeNull()
    expect(decodeCursor(undefined)).toBeNull()
    expect(decodeCursor('')).toBeNull()
  })

  it('returns null for malformed base64/JSON', () => {
    expect(decodeCursor('!!!not-base64!!!')).toBeNull()
  })

  it('returns null when required fields are absent', () => {
    expect(decodeCursor(encode({ id: 'abc' }))).toBeNull()
    expect(decodeCursor(encode({ createdAt: 'x' }))).toBeNull()
  })
})
