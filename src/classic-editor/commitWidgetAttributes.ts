import type { MinimalTinyClassicEditor } from './types/MinimalTinyClassicEditor'
import { writeWidgetAttributes } from './writeWidgetAttributes'

/**
 * Applies an edited attribute map to a placed widget so it persists on
 * "Guardar". The write runs inside a tinymce undo transaction (a tracked,
 * undoable edit), then Staffbase's richTextField._registerChange re-diffs the
 * content and flips its per-locale dirty flag — without that flag the classic
 * editor treats a programmatic attribute change as no change and saves nothing.
 * The tinymce global lives on the top window where the bundle runs; falls back
 * to a plain write if the editor APIs are unavailable.
 * @param {HTMLElement} element - The widget element to update.
 * @param {Record<string, string>} values - The edited attribute map.
 * @returns {void}
 */
export const commitWidgetAttributes = (
  element: HTMLElement,
  values: Record<string, string>,
): void => {
  const editor = (
    window as unknown as {
      tinymce?: { activeEditor?: MinimalTinyClassicEditor }
    }
  ).tinymce?.activeEditor

  /**
   *
   */
  const write = (): void => {
    writeWidgetAttributes(element, values)
  }

  if (editor?.undoManager?.transact) editor.undoManager.transact(write)
  else write()

  editor?.settings?.richTextField?._registerChange?.()
  editor?.setDirty?.(true)
  editor?.nodeChanged?.()
}
