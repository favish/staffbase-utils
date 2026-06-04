import { ApiError } from './ApiError'

describe('ApiError', () => {
  it('carries the status and message and is an Error', () => {
    const err = new ApiError(404, 'not found')
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(404)
    expect(err.message).toBe('not found')
    expect(err.name).toBe('ApiError')
  })
})
