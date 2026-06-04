/**
 * Window augmented with the Staffbase host auth manager (`window.we.authMgr`),
 * which exposes the session CSRF token. Every level is optional because the host
 * global may be absent (e.g. outside the Staffbase shell).
 */
export interface WindowWithStaffbaseAuth {
  we?: {
    authMgr?: {
      getCsrfToken?: () => string | undefined
    }
  }
}
