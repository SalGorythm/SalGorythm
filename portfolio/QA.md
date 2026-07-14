# Portfolio QA checklist (Prompt 7 — Skeptic-Filter)

Internal peer-review matrix for responsiveness, stability, and load velocity.

## Responsive matrix (320px – 1440px)

| Surface | 320 | 768 | 1024 | 1440 | Notes |
|---------|-----|-----|------|------|-------|
| Hero validation strip | ✓ | ✓ | ✓ | ✓ | Plain-language CTAs, min-h-11 tap targets |
| Compact CV gate | ✓ | ✓ | ✓ | ✓ | Sticky on lg; stacks on mobile |
| Case study matrix | ✓ | ✓ | ✓ | 3-col | Cards equal height flex |
| Live demo strip | ✓ | ✓ | 3-col | 3-col | Lazy intersection observer |
| Vertical project lens | ✓ | ✓ | ✓ | ✓ | Wrap toggles on narrow viewports |
| Résumé funnel strip | ✓ | 2-col | 4-col | 4-col | Grid collapses gracefully |

## Performance targets

| Metric | Target | How verified |
|--------|--------|--------------|
| LCP | < 2.5s | Run Lighthouse on production build |
| CLS | < 0.1 | No layout shift from lazy demo previews |
| Bundle split | Tools lazy | `ToolsPage` route chunk separate |
| Fonts | swap | Google Fonts `display=swap` in index.html |

## Asset audit

- CV PDF: `public/cv/sds-salman-akhatar-cv.pdf` (~80 KB)
- CV DOCX: `public/cv/sds-salman-akhatar-cv.docx` (~13 KB)
- pdf.worker: lazy-loaded with Tools route only
- No hero images — CSS gradients only (fast LCP)

## SEO / trust signals

- JSON-LD `Person` schema in `index.html`
- Open Graph title + description
- Semantic section headings with `aria-labelledby`

## Cross-browser spot-check

- [ ] Chrome / Edge (Chromium)
- [ ] Safari (macOS + iOS)
- [ ] Firefox

## Pre-deploy command

```bash
cd portfolio && npm run lint && npm run build
```

## Funnel audit (Prompt 8)

Compare `data/stats.json` fields:

- `visitor` — portfolio sessions
- `resume-download` — CV CTR
- `tool-*` + `game-*` + `lab-*` — proof-of-code engagement

If visits ≫ sandbox plays → live demos placement is correct (post-hero).
If downloads lag visits → compact gate in hero is primary path; full gate in `#resume`.
