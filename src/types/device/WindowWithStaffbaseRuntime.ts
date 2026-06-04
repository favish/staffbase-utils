/**
 * Window augmented with the Staffbase runtime flags (`window.we`) that report
 * whether the app is running inside the native shell and on a mobile platform.
 * Optional because the runtime is absent outside the Staffbase shell.
 */
export interface WindowWithStaffbaseRuntime {
  we?: {
    native?: boolean
    mobile?: boolean
  }
}
