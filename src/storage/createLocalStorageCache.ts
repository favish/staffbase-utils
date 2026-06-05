import type { LocalStorageCache } from '../types/storage/LocalStorageCache'
import { canUseLocalStorage } from './canUseLocalStorage'

interface CacheEnvelope<T> {
  updatedAt: number
  value: T
}

/**
 * Creates a TTL-bounded localStorage cache for a single JSON-serializable value.
 *
 * Generalizes the per-widget option caches (e.g. the alerts channel-options
 * cache): entries older than `ttlMs` read as null, all access is guarded so it
 * never throws (storage disabled, quota, SSR), and malformed entries are
 * treated as a miss. The value is wrapped with a timestamp under `key`.
 * @template T The cached value type.
 * @param {string} key - The localStorage key.
 * @param {number} ttlMs - Time-to-live in milliseconds.
 * @returns {LocalStorageCache<T>} The cache handle (read/write/clear).
 */
export const createLocalStorageCache = <T>(
  key: string,
  ttlMs: number,
): LocalStorageCache<T> => ({
  read() {
    if (!canUseLocalStorage()) return null
    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) return null
      const parsed = JSON.parse(raw) as CacheEnvelope<T>
      if (!parsed || typeof parsed.updatedAt !== 'number') return null
      if (Date.now() - parsed.updatedAt > ttlMs) return null
      return parsed.value
    } catch {
      return null
    }
  },
  write(value: T) {
    if (!canUseLocalStorage()) return
    try {
      const envelope: CacheEnvelope<T> = { updatedAt: Date.now(), value }
      window.localStorage.setItem(key, JSON.stringify(envelope))
    } catch {
      // Ignore quota/serialization failures: the cache is best-effort.
    }
  },
  clear() {
    if (!canUseLocalStorage()) return
    try {
      window.localStorage.removeItem(key)
    } catch {
      // Ignore.
    }
  },
})
