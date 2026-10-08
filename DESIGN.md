---
name: BCPS Learning Hub
description: Warm bone-paper exam-study hub in the AinaDara house style
colors:
  bone-paper: "#faf5ed"
  warm-card: "#fffcf6"
  parchment: "#f2ecdf"
  ink: "#2d3428"
  moss-gray: "#5a6151"
  faded-moss: "#8a8e80"
  terracotta: "#cc785c"
  terracotta-ink: "#a85a38"
  terracotta-tint: "#f3e3da"
  deep-plum: "#4a3d7a"
  moss: "#4a5c28"
  sec-study: "#b8873a"
  sec-quiz: "#5b6ea8"
  sec-cards: "#a8547a"
  sec-drugs: "#3f8f7a"
  sec-visuals: "#4a8aa4"
  sec-exam: "#b85a42"
  sec-evidence: "#6b5b95"
  sec-glossary: "#5c7a3a"
  sec-mock: "#4a5a72"
  sec-more: "#5f7488"
typography:
  display:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontWeight: 400
    letterSpacing: "0.005em"
  body:
    fontFamily: "Outfit, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: 1.5
  label:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  pill: "20px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.terracotta-ink}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "9px 18px"
  button-primary-active:
    backgroundColor: "#8f4c30"
  button-secondary:
    backgroundColor: "rgba(45,52,40,.05)"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "9px 18px"
  card:
    backgroundColor: "{colors.warm-card}"
    rounded: "{rounded.lg}"
  chip:
    backgroundColor: "{colors.terracotta-tint}"
    textColor: "{colors.terracotta-ink}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
---

# Design System: BCPS Learning Hub

## Overview

**Creative North Star: "The Warm Study Desk"**

A calm desk by a window: bone paper, warm light, one well-worn reference book. The interface is the desk, not the show — everything on screen serves a pharmacist stealing twenty minutes of study, so the base stays warm and quiet while color appears only where it helps you find your way. The personality is soft and unhurried: generous radii, feather shadows, gentle hover lifts; nothing snaps or shouts. A serif voice (DM Serif Display) gives headings the authority of a bound reference, while a light-weight geometric sans (Outfit) keeps working text modern and effortless.

Density is moderate and deliberate: tight inside a card, generous between cards, and the primary content of a screen is never buried under chrome. Dark mode is a first-class rendering of the same desk after sundown — deep warm umber, not gray — and every surface must stay readable there. Confirmed anti-reference: **clinical SaaS blue**. The generic blue-gray dashboard look is what this palette exists to reject; no hue may drift toward default-Bootstrap blue.

**Key Characteristics:**
- Warm bone-paper world in both themes (umber dark mode, never slate)
- Serif display voice over light sans body
- Muted-jewel section spectrum used for wayfinding only
- Soft, unhurried components: 12–16px radii, feather shadows, calm ease-out motion
- Evidence-based floors: 4.5:1 small-text contrast, 11px functional-text minimum, reduced-motion honored

## Colors

A warm neutral base carrying one terracotta voice, with a muted-jewel spectrum reserved for section wayfinding.

### Primary
- **Terracotta Ink** (#a85a38): the working accent — primary buttons, links, small accent text, active states. Darkened from the brand terracotta specifically to hold 4.5:1 on paper; this is the terracotta you read.
- **Terracotta** (#cc785c): the brand terracotta — large display numerals, the italic "Hub" in the wordmark, icon tints, decorative gradients. Display-size and decorative use only; never small text on paper.
- **Terracotta Tint** (#f3e3da): soft fill behind terracotta chips and selected states.

### Secondary
- **Deep Plum** (#4a3d7a): the brand's second voice — exam-psychology accents, dark drill-card gradients, the compass in the brand mark.
- **Moss** (#4a5c28): the brand's third voice — success-adjacent accents and the arc in the brand mark.

### Tertiary — the section spectrum
Eleven muted-jewel hues, one per section, held to similar saturation and lightness so the set reads as one family: study #b8873a, quiz #5b6ea8, cards #a8547a, drugs #3f8f7a, visuals #4a8aa4, exam #b85a42, evidence #6b5b95, glossary #5c7a3a, mock #4a5a72, more #5f7488 (home uses the brand terracotta). Each has a brighter dark-mode twin defined on `body.dark-mode`.

### Neutral
- **Bone Paper** (#faf5ed): the page. Dark mode: deep umber #1c1815.
- **Warm Card** (#fffcf6): raised surfaces. Dark mode: #252119.
- **Parchment** (#f2ecdf): secondary surfaces, wells. Dark mode: #322d24.
- **Ink** (#2d3428): primary text — a green-black, never pure black. Dark mode: warm cream #ece4d2.
- **Moss Gray** (#5a6151): secondary text. Dark mode: #b8af9d.
- **Faded Moss** (#8a8e80): tertiary text, inactive icons. Dark mode: #7d7666.
- Separators are ink at 10–12% alpha, fills at 5%.

### Named Rules
**The Wayfinding Rule.** The section spectrum appears only on icons, chips, and small accents — never on body text and never as a large surface. The base UI stays calm so the color can mean something.

**The No-Blue Rule.** There is no neutral blue in this system. Anything drifting toward default SaaS blue (#007AFF, #0d6efd and kin) is a regression, not a choice; the nearest sanctioned hues are the quiz slate-indigo (#5b6ea8) and visuals teal (#4a8aa4).

## Typography

**Display Font:** DM Serif Display (with Georgia, serif)
**Body Font:** Outfit (with system-ui, sans-serif)

**Character:** A literary serif lends headings the authority of a printed reference; the light-weight geometric sans keeps everything you actually work in airy and modern. The pairing is the brand: bookish warmth over clinical efficiency.

### Hierarchy
- **Display** (400, 44px, 1.05): the home hero wordmark only; italic terracotta em for "Hub".
- **Headline** (400 serif, ~1.5rem): section titles, paired with a tinted icon chip.
- **Title** (600–700 sans, 0.9–1.05rem): card titles, question stems.
- **Body** (300, 16px, 1.5): reading text; 0.82–0.85rem inside dense cards.
- **Label** (500–600, 11px floor): tab labels, stat captions, chips. Nothing functional renders below 11px.

### Named Rules
**The Serif-Leads Rule.** Serif for identity moments (page and section headings); sans for everything interactive. Never set controls or body copy in the serif.

## Layout

Single-column, mobile-first flow inside a 20px page gutter, with a sticky translucent header (56px) and a fixed 9-tab bottom bar (72px + safe-area). Content is organized as stacked cards on the paper; grids appear only where items are genuinely equivalent (home tool cards at `minmax(140px,1fr)`, More hub 2-col ≥600px, quiz filters 2-col mobile / 3-col ≥640px, visuals 2-col ≥640px with aligned card heads). Rhythm: 8px between siblings, 12–14px between cards, 16px card padding, 24–28px between sections. The primary content of a screen sits above the fold on a 420px phone; stat strips stay compact single rows. Reference material beyond the core loop lives one tap deeper in the More hub rather than widening the tab bar.

## Elevation & Depth

Hybrid, ambient-first. Surfaces rest on feather shadows and rise slightly on hover (`translateY(-2px)` + one shadow step); depth responds to state rather than decorating rest. No colored glows, no zero-offset halos.

### Shadow Vocabulary
- **shadow-1** (`0 1px 2px rgba(45,52,40,.05), 0 2px 8px rgba(45,52,40,.05)`): resting cards.
- **shadow-2** (`0 2px 6px rgba(45,52,40,.07), 0 8px 20px rgba(45,52,40,.07)`): hover lift, score bars.
- **shadow-3** (`0 8px 24px rgba(45,52,40,.14), 0 2px 8px rgba(45,52,40,.08)`): overlays, modals.
- Dark mode redefines all three in true black alphas (.16–.4) — ink-tinted shadows vanish on umber.

### Named Rules
**The Warm Shadow Rule.** Light-mode shadows are tinted with ink (#2d3428), never pure black — shadow is part of the paper, not soot on it.

## Shapes

Soft rectangles everywhere: 12px for controls, 14–16px for cards, 18–20px for hero cards and question cards, full pills (20px) for chips and badges, circles only for the icon-chip wells, A–Z buttons, and the theme toggle. Borders are hairlines (0.5–1.5px) in low-alpha ink; thick colored side-borders are banned. Icons are drawn SVG strokes — 1.6 stroke-width, round caps and joins — sitting in tinted `color-mix` chips (16% of the section hue).

## Components

### Buttons
- **Shape:** gently rounded (12px), inline-flex with 5px icon gap.
- **Primary:** Terracotta Ink (#a85a38) with white text, 9px 18px padding, 600 weight at 0.85rem.
- **Hover / Focus:** 0.15s all; press scales to 0.96 and deepens to #8f4c30. Focus is a 2px terracotta outline, offset 2px.
- **Secondary:** 5%-ink fill with ink text, same geometry; deepens on press.

### Chips
- **Style:** pill (20px radius), 3px 10px padding, 0.65–0.7rem at 600–700 weight.
- **State:** tinted-fill style — section hue at ~16% over transparent (or Terracotta Tint) with the hue as text; selected filter chips invert to solid hue with white text.

### Cards / Containers
- **Corner Style:** 14–16px (20px for question cards).
- **Background:** Warm Card over Bone Paper; Parchment for inner wells.
- **Shadow Strategy:** shadow-1 at rest, shadow-2 + 2px lift on hover (see Elevation).
- **Border:** optional 0.5–1px low-alpha ink hairline; never a thick colored edge.
- **Internal Padding:** 14–20px.

### Inputs / Fields
- **Style:** filled, borderless (12px radius, 8px 12px padding) on a 12%-gray fill; search fields may carry a 1.5px hairline.
- **Focus:** fill deepens; `:focus-visible` adds the global 2px terracotta outline.

### Navigation
- **Bottom tab bar:** fixed, frosted (blur + 92% paper), 9 tabs. Each tab's SVG icon permanently carries its section hue at 72% opacity; the active tab gets a 15% tinted chip behind the icon and a 600-weight label in its hue. Labels 11px.
- **Header:** sticky, frosted, brand mark + serif wordmark + Search pill; circular theme toggle (stroke moon/sun) floats at top-right.
- **More sub-nav:** pill row ("← More" + four sub-tabs) repeated atop each reference section; active pill fills with its section tint.

### Icon Chip (signature)
The recurring identity atom: a rounded square (8–14px by size) filled with a section hue at 16% via `color-mix`, containing a 1.6-stroke SVG icon in the full hue. It marks every section header, home card, tab, and More-hub card — the one place color is allowed to be rich.

## Do's and Don'ts

### Do:
- **Do** keep both themes warm: umber darks (#1c1815 family), cream text (#ece4d2) — follow The Warm Shadow Rule.
- **Do** hold small text to 4.5:1 (use Terracotta Ink #a85a38, never raw #cc785c, for small accents on paper) and functional text to the 11px floor.
- **Do** use calm ease-out motion (`cubic-bezier(0.22,1,0.36,1)`, 0.15–0.3s) and honor `prefers-reduced-motion`.
- **Do** draw icons as 1.6-stroke SVGs in icon chips; new sections get a new muted-jewel hue defined for both themes.
- **Do** keep canvases at their drawn pixel height — scale the layout, never the bitmap.

### Don't:
- **Don't** introduce neutral blues, grays, or any clinical-SaaS default hue (The No-Blue Rule).
- **Don't** use emoji as UI chrome, thick colored side-borders, colored glow shadows, or overshoot/bounce easings — all were removed deliberately.
- **Don't** put section-spectrum color on body text or large surfaces (The Wayfinding Rule).
- **Don't** add tabs to the main bar; deeper material joins the More hub.
- **Don't** reintroduce login/sync UI or any feature that breaks the static, local-first model.
