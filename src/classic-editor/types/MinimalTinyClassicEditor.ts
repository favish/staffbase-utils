/**
 * The minimal slice of the tinymce editor API the library uses to persist a
 * programmatic attribute change. `settings.richTextField._registerChange`
 * re-diffs the content against the saved snapshot and flips Staffbase's
 * per-locale dirty flag — the only reliable way to make "Guardar" save a
 * programmatic change in the classic editor.
 */
export interface MinimalTinyClassicEditor {
  settings?: { richTextField?: { _registerChange?: () => void } }
  undoManager?: { transact?: (fn: () => void) => void }
  setDirty?: (state: boolean) => void
  nodeChanged?: () => void
}
