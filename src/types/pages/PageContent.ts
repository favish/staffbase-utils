/**
 * The per-locale content of a page (one entry of a page's `contents` map, keyed
 * by locale code such as `en_US`, `de_DE` or `ja_JP`).
 *
 * Curated from a live prod read of all 1104 pages on the teamaag tenant
 * (1108 locale entries across three locales). Every subfield is optional because
 * each was genuinely absent on some entries: `title` 1106/1108, `content`
 * 1098/1108 (drafts/empty pages omit it), `description` only 90/1108. The
 * official Pages API spec (`PageResponseSchema.contents.en_US`) types only
 * `title` and `content` and hardcodes the `en_US` key; `description` and the
 * multi-locale map are undocumented but real.
 */
export interface PageContent {
  title?: string
  content?: string
  description?: string
}
