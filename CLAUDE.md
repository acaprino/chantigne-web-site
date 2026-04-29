# CLAUDE.md

Static showcase website for **Pasticceria Chantigne** (Acquedolci, ME -- Sicily). Single-page Italian site, vanilla HTML/CSS/JS, no build chain.

Tagline: *Il dolce tempo delle cose fatte bene.*

## Project structure

```
chantigne/
├── index.html      Full page markup (~360 lines). All sections inline:
│                   nav, hero, marquee, specialità, storia, eventi,
│                   gallery, testimonianze, prenota, footer.
├── styles.css      Design tokens + layout + animations + responsive
│                   (~1150 lines). Breakpoints at 1024 / 760 / 420 px.
├── app.js          IIFE with hero video ping-pong loop, mobile drawer,
│                   specialità tabs (hover/click/focus), testimonials
│                   slider, prenota form (no backend -- JS-only success state).
├── img/            Real photos in WebP + hero.mp4 (1.7 MB) for hero bg.
│                   colazione, croissant, vetrina, torta, colombe.
├── README.md       Public-facing summary.
├── CLAUDE.md       This file.
└── .gitignore      OS / editor / node_modules (no build, but reserved).
```

No `package.json`, no `node_modules`, no bundler, no test runner, no linter.

## Stack

- **HTML5** -- `lang="it"`. Semantic sections, ids used as scroll targets and as JS hooks.
- **CSS** -- design tokens in `:root` (`--bg`, `--ink`, `--accent`, `--font-display`, `--font-body`, `--maxw`, `--pad`). BEM-ish class naming (`.nav__brand`, `.hero__bg`, `.specialita__row`).
- **JS** -- single IIFE in `app.js`, no modules, no dependencies. Plain DOM APIs, `requestAnimationFrame` for the hero ping-pong.
- **Fonts** -- Google Fonts `Cormorant Garamond` (display) + `Inter` (body) via stylesheet link.
- **Images** -- WebP only (~1 MB total). Hero background is `img/hero.mp4`, muted, autoplay, ping-pong loop.

## Run locally

```bash
python -m http.server 8000
# http://localhost:8000/
```

There is no other dev workflow. No build step, no watch task, no formatter to run before committing.

## Conventions

**Always use design tokens.** Never hardcode colors, fonts, or `--maxw`/`--pad`. If a token is missing, add it to `:root` rather than inlining a literal.

**Add sections inline in `index.html`.** Follow the existing pattern: `<section class="section <name>" id="<id>">` with an `.eyebrow` numbered label (`-- 0X / Title`) and an `.section__title` heading. Don't split into partials -- keep the single-file structure.

**Italian copy.** All user-facing strings are in Italian. Match the existing tone: warm, confident, family/heritage vocabulary (*"il dolce tempo delle cose fatte bene"*, *"tre generazioni"*, *"lievito madre vivo"*). Never use em dashes in copy or commits -- use `-` or `--`.

**Responsive.** Use the existing breakpoints (`1024`, `760`, `420`). Mobile-first is not the convention here -- desktop styles are the base, then `@media (max-width: ...)` blocks override.

**JS scope.** Everything lives in the single IIFE in `app.js`. Add new behaviors as a labeled block (`// ============= NAME =============`) inside it. Guard DOM lookups with `if (el)` when an element might be absent (see hero video pattern).

**Hero video.** `img/hero.mp4` is pre-baked as a boomerang (forward + reversed concatenated with `ffmpeg -filter_complex "[0:v]split[v1][v2];[v2]reverse[vr];[v1][vr]concat=n=2:v=1:a=0[out]"`). The HTML uses native `loop` and the JS only sets `playbackRate = 0.5`. Do NOT scrub `currentTime` backward via rAF -- that approach causes judder because mp4 keyframes are 1-2 s apart and the browser cannot decode arbitrary intermediate frames in reverse. To change speed, edit the `SPEED` constant in `app.js`. To change the loop pattern, re-encode the file with ffmpeg.

**Form prenotazione has no backend.** The submit handler in `app.js` swaps the form for a confirmation block. If a real backend gets wired up, replace the `formEl.addEventListener('submit', ...)` body -- don't add fetch logic alongside the fake handler.

## Provisional data -- ask before changing

Per `README.md`, these are placeholders:
- Email addresses, opening hours
- All testimonials in `app.js` (`REVIEWS` array)
- "Eventi & Catering" section copy and pills

These are real and verified:
- Address: Corso Italia, 79 -- 98070 Acquedolci (ME)
- Phone: +39 0941 727249
- Instagram: @pasticceria_chantigne

When asked to update placeholders without explicit values, flag the gap rather than inventing data.

## Git

- Repo: `https://github.com/acaprino/chantigne-web-site.git`
- Branch: `main`
- On Windows, expect `LF will be replaced by CRLF` warnings on commit. Don't change `core.autocrlf` to silence them -- leave the repo's defaults.

## Deploy

Not configured in-repo. No GitHub Actions, no Netlify/Vercel config, no `gh-pages` branch, no `CNAME`. Ask the user where production lives before suggesting deploy steps.

## Things Claude should not do

- Don't introduce a build chain, framework, or `package.json` without an explicit request -- the README states the project is vanilla on purpose.
- Don't replace WebP images with PNG/JPG -- original PNGs were ~35 MB; WebP keeps the repo at ~1 MB.
- Don't add em dashes to copy or commit messages. Use `-` or `--` instead.
- Don't refactor `app.js` into modules. Single IIFE is the chosen shape.
- Don't write tests -- there's no harness and the project doesn't need one yet.
