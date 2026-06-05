import type { STAFFBASE_LOCALES } from '../../i18n/staffbaseLocales'

/**
 * Union of every Staffbase-supported content locale code (e.g. `'en_US'`,
 * `'de_DE'`, `'ja_JP'`). Derived from the `STAFFBASE_LOCALES` map so the type
 * and the runtime list can never drift apart.
 */
export type StaffbaseLocale = keyof typeof STAFFBASE_LOCALES
