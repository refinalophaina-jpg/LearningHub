/* Slide decks / study-guide PDFs — hosted on Cloudflare R2, same bucket as the
   podcasts. Filled in once real R2 object keys are confirmed (do not guess
   filenames here — verify each one with a HEAD request before adding it). */
window.__SLIDES_BASE = 'https://audio.ainadara.com/Notebook%20llm%20pdf%20slides/';
window.__SLIDES = [
  // { file: '<exact R2 key>.pdf', title: '...', area: '...' },
];
