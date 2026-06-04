/**
 * Type guard for Promise-like (thenable) values, used to normalize whatever
 * Staffbase's openLink returns.
 * @param {unknown} value - The value to test.
 * @returns {boolean} True when value has a callable then method.
 */
export const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  value !== null &&
  typeof value === 'object' &&
  'then' in value &&
  typeof (value as PromiseLike<unknown>).then === 'function'
