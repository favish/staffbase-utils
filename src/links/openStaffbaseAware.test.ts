import { openStaffbaseAware } from './openStaffbaseAware'

describe('openStaffbaseAware', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    delete (window as unknown as { staffbase?: unknown }).staffbase
    jest.restoreAllMocks()
  })

  it('returns false for empty href', () => {
    expect(openStaffbaseAware('')).toBe(false)
  })

  it('returns false for scripted hrefs (guarded)', () => {
    expect(openStaffbaseAware('javascript:alert(1)')).toBe(false)
  })

  it('delegates to staffbase.plugin.util.openLink when present', () => {
    const openLink = jest.fn().mockReturnValue(undefined)
    ;(window as unknown as { staffbase: unknown }).staffbase = {
      plugin: { util: { openLink } },
    }
    const handled = openStaffbaseAware('https://app.staffbase.com/news/1')
    expect(handled).toBe(true)
    expect(openLink).toHaveBeenCalledWith(
      'https://app.staffbase.com/news/1',
      {},
    )
  })
})
