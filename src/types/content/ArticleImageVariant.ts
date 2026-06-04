/**
 * A single rendition of an article image (a size/format variant returned by the
 * Staffbase media API). `size` is only present on the original variant.
 */
export interface ArticleImageVariant {
  width: number
  height: number
  size?: number
  format: string | null
  mimeType: string | null
  url: string
}
