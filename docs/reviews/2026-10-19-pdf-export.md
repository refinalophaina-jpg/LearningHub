# Annotated PDF export

The reader’s Download annotated PDF action creates a copy of the active volume with all saved highlights and page notes, including comments on other pages. Notes stay local: pdf-lib 1.17.1 is vendored with its MIT license and loads on demand. The source books, study storage and backups are not modified by export.

Highlights use native Highlight annotations, QuadPoints, Unicode Contents and explicit translucent appearance streams. Page notes use native Text annotations with visible note icons and Unicode Contents. Existing source annotation arrays are appended to. Normalized visual coordinates are inverted through each PDF.js page viewport, including crop offsets, rotation and user-unit scaling. A prepared PDF link remains after automatic download. The operation captures a snapshot; later edits require another export.

Validation:

- 34 tests pass; nine-bank build passes. Both complete books export, retain their original page counts/metadata and preserve annotation counts on every source page. Unicode comments, multi-line highlights, last-page notes, invalid state and mismatched books are covered. Geometry tests cover all four quarter-turns, nonzero crop offsets and doubled user units.
- Isolated localhost browser: created a real text selection/highlight and a page note on Volume 1 page 50; edited both comments; reloaded and verified persistence; generated the PDF, checked progress/ready states and saved the prepared file through its download link.
- Actual browser-downloaded file: 8,087,318 bytes; SHA-256 `638ff4fe9cf0eefd0d2cf4c6ca1f8a9a37058605dc8a0b529eff28b1d199f5bc`. PyMuPDF 1.27.2.3 reopened all 646 pages, found both native annotations and recovered the full Unicode comment and page note. An independent rendered page inspection confirmed the highlight on the selected text and a note icon.
- Light desktop and dark desktop/390px phone reader controls inspected. Export is labeled, the busy state disables duplicate requests, status is announced and the save link remains available. Production user notes were not edited for testing.

The supplied Volume 1 contains a malformed pre-existing popup dictionary (object 2206). pdf-lib reports this while preserving its raw object. Source rendering and the exported file reopen successfully; the original supplied PDF is not repaired or overwritten. PDF comments require a viewer with annotation support. External PDF edits do not sync into the hub; use Save backup to transfer hub editing state.
