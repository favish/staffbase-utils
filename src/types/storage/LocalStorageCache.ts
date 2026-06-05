/**
 * A small TTL-bounded localStorage cache for a single value, as returned by
 * createLocalStorageCache.
 * @template T The cached value type.
 */
export interface LocalStorageCache<T> {
  /**
   * Reads the cached value, or null when missing, expired, unparseable, or when
   * localStorage is unavailable.
   * @returns {T | null} The cached value, or null.
   */
  read: () => T | null
  /**
   * Writes the value with a fresh timestamp. A no-op when localStorage is
   * unavailable; never throws.
   * @param {T} value - The value to cache.
   * @returns {void} Nothing.
   */
  write: (value: T) => void
  /**
   * Removes the cached entry. A no-op when localStorage is unavailable.
   * @returns {void} Nothing.
   */
  clear: () => void
}
