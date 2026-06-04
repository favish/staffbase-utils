/**
 * Result of attempting to open a link through Staffbase's plugin util.openLink.
 */
export interface TryOpenResult {
  /** Whether Staffbase handled the open call. */
  handled: boolean
  /** The promise openLink returned, when it returned one. */
  promise?: Promise<void>
}
