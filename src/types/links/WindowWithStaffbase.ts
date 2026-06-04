/**
 * Window augmented with the Staffbase plugin util surface used for in-app link
 * opening. The whole chain is optional because the host API may be absent.
 */
export interface WindowWithStaffbase extends Window {
  staffbase?: {
    plugin?: {
      util?: {
        openLink?: (link: string, opts?: unknown) => unknown
      }
    }
  }
}
