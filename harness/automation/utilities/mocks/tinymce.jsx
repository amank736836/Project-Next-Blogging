/**
 * Stand-in for @tinymce/tinymce-react's <Editor>.
 *
 * Why a separate module: `vi.mock` factories are hoisted above imports, so the
 * replacement has to be dynamically importable and cannot be defined inline
 * with hooks in the test file.
 *
 * Fidelity note — read this before "simplifying" it:
 * the real TinyMCE is an *uncontrolled external widget*. React Hook Form's
 * Controller hands it `initialValue` once and then only receives
 * `onEditorChange` callbacks; RHF never pushes `field.value` back in. This mock
 * mirrors that by owning its own state, seeded once at mount.
 *
 * An earlier version rendered `<textarea defaultValue={initialValue}>`. Because
 * PostForm re-renders on every keystroke (the live word counter reads
 * `useWatch({ name: 'content' })`), `getValues('content')` produced a NEW
 * `initialValue` each render, React re-applied `defaultValue`, and userEvent
 * lost the caret after the first character. That was a mock defect, not an
 * application bug — do not re-introduce it.
 */
import React, { useState } from 'react';

export function FakeEditor({ onEditorChange, initialValue = '' }) {
  const [value, setValue] = useState(initialValue);

  return (
    <textarea
      data-testid="rte"
      aria-label="content"
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        onEditorChange?.(event.target.value);
      }}
    />
  );
}

export const Editor = FakeEditor;
