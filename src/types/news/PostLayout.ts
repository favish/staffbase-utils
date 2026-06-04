/**
 * Layout hints a news post carries for its primary media presentation.
 *
 * Grounded in the `PostSearchDTO` example of the official News API spec
 * (`https://developers.staffbase.com/openapi/newsapi.yaml`), where `layout` is
 * `{ "primaryMedia": "big-first" }`. Typed as `string` because the spec does
 * not enumerate the allowed values.
 */
export interface PostLayout {
  primaryMedia: string
}
