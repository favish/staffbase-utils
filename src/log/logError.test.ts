import { logError } from './logError'
import { setLoggingEnabled } from './setLoggingEnabled'

describe('logError', () => {
  afterEach(() => {
    setLoggingEnabled(false)
    jest.restoreAllMocks()
  })

  it('does not log when disabled (production default)', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    logError('boom')
    expect(spy).not.toHaveBeenCalled()
  })

  it('forwards args to console.error when enabled', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    setLoggingEnabled(true)
    logError('boom', 42)
    expect(spy).toHaveBeenCalledWith('boom', 42)
  })
})
