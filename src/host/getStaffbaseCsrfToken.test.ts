import { getStaffbaseCsrfToken } from './getStaffbaseCsrfToken'

describe('getStaffbaseCsrfToken', () => {
  afterEach(() => {
    delete (window as { we?: unknown }).we
  })

  it('returns the token when the host exposes one', () => {
    ;(window as { we?: unknown }).we = {
      authMgr: { getCsrfToken: () => 'tok-123' },
    }
    expect(getStaffbaseCsrfToken()).toBe('tok-123')
  })

  it('returns null when the auth manager is absent', () => {
    expect(getStaffbaseCsrfToken()).toBeNull()
  })

  it('returns null for an empty token', () => {
    ;(window as { we?: unknown }).we = {
      authMgr: { getCsrfToken: () => '' },
    }
    expect(getStaffbaseCsrfToken()).toBeNull()
  })
})
