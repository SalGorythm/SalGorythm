# Portfolio QA checklist (V2 immersive + writing hub)

## Responsive matrix (320px – 1440px)

| Surface | 320 | 768 | 1024 | 1440 | Notes |
|---------|-----|-----|------|------|-------|
| Full-viewport 3D | CSS fallback | CSS fallback | WebGL + bloom | WebGL + bloom | Fixed canvas z-0 |
| Hero + panels | ✓ | ✓ | ✓ | ✓ | `bg-slate-950/40` + backdrop-blur over canvas |
| Writing section | ✓ | ✓ | 3-col featured | 3-col | Hover syncs 3D writing nodes |
| `/writing` index | ✓ | ✓ | tag filter + search | ✓ | Lazy route chunk |
| `/writing/:slug` | ✓ | ✓ | TOC sidebar lg+ | ✓ | BlogPosting JSON-LD |
| Keyboard jumps | 1–9 | 1–9 | 1–9 | 1–9 | Major sections on portfolio |

## V2 3D checklist

- [ ] Desktop: full-viewport Canvas (not 42% rail)
- [ ] Icosahedron core + satellite nodes + edge particle flow
- [ ] Spline camera driven by scroll progress
- [ ] Writing cluster (13 orbiting nodes) — click opens `/writing/:slug`
- [ ] Bloom enabled desktop only; off when `performanceDegraded`
- [ ] Mobile / reduced motion: CSS `immersive-bg-fallback` animation
- [ ] `PerformanceMonitor` persists WebGL disable to sessionStorage
- [ ] Node hover tooltip bottom-right on desktop

## Writing hub checklist

- [ ] 13 articles in `src/content/articles/*.md`
- [ ] Tags: prompting, agents, loops, interview-prep, python, deployment, claude, cursor
- [ ] Featured 3 on home `#writing` section
- [ ] Navbar "Writing" link
- [ ] Prev/next navigation on article pages

## Performance targets

| Metric | Target | How verified |
|--------|--------|--------------|
| LCP | < 2.5s | Hero text; Canvas lazy |
| Main bundle | Articles lazy-loaded | Writing routes + markdown glob async |
| PortfolioScene chunk | ~260KB gzip | Separate lazy chunk |
| Canvas DPR | ≤ 2 desktop | `useSceneDpr` |

## Pre-deploy command

```bash
cd portfolio && npm run lint && npm run build
```

## Cross-browser spot-check

- [ ] Chrome / Edge (Chromium) — WebGL + bloom
- [ ] Safari (macOS + iOS) — fallback tier
- [ ] Firefox — scroll + camera
