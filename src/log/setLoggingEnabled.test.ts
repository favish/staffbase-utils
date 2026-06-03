import { loggingState } from './loggingState'
import { setLoggingEnabled } from './setLoggingEnabled'

describe('setLoggingEnabled', () => {
  afterEach(() => setLoggingEnabled(false))

  it('defaults to disabled', () => {
    expect(loggingState.enabled).toBe(false)
  })

  it('enables and disables logging', () => {
    setLoggingEnabled(true)
    expect(loggingState.enabled).toBe(true)
    setLoggingEnabled(false)
    expect(loggingState.enabled).toBe(false)
  })
})
