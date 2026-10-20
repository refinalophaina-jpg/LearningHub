# ACCP course material removal — October 20, 2026

## Decision
The owner asked whether hosting the two 2024 ACCP *Updates in Therapeutics®* PDF volumes publicly could cause trouble, and directed removal if so. It does:

- The book's own copyright page (Vol 1, PDF p. 5): "No part of this publication may be reproduced, stored in a retrieval system, or transmitted, in any form or by any means, electronic or mechanical, including photocopy, without prior written permission of the American College of Clinical Pharmacy."
- ACCP's trademarks and permissions page (https://www.accp.com/about/trademarks.aspx): written permission is required to reuse any material from ACCP publications, and *Updates in Therapeutics* is a registered trademark.

No written ACCP permission is on file, so the earlier 2026-10-19 publication decision is superseded.

## What changed
- Removed `app/books/` (both volumes), the PDF.js reader, annotation store and annotated-PDF export, vendored PDF.js and pdf-lib, the Study Guide library card, and the reader's tests.
- Backups no longer carry PDF notes. Older backup files that include them still restore; the notes field is ignored. "Reset everything" still clears leftover local notes.
- Purged both PDFs from every commit in the repository's history and force-pushed; merged feature branches that still referenced them were deleted.
- Sources page now states that ACCP materials are not hosted, points to the ACCP store, and carries the trademark and not-affiliated notice.
- `*.pdf` is gitignored and a release test fails if any PDF ships in `app/`.

## Kept
The 150-case original mock, the quiz bank (no ACCP-mock items remain; verified by 6-word shingle overlap against the retired bank: max 3% for the mock, 0 near-verbatim quiz stems), and the chapter-referenced study notes.

## Open
- Podcasts and slide decks hosted at audio.ainadara.com may be generated from the ACCP book. They are outside this repository and were not reviewed here.
- GitHub may retain copies of the old commits through closed pull request refs and cached views until GitHub Support purges them.
