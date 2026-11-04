# ease — prototype

A web prototype of **ease**, a menopause support app (CBT, symptom tracking, HRT
guidance). Presented in a phone frame so it reads as an app but runs in any browser.

## The funnel (no landing — opens straight into it)

```
Quiz intro → Quiz (~20 Qs + promo slides) → [smooth "analyzing" animation]
  → Symptom Score → Email capture → Paywall → Purchase → App home (SOS)
```

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/index.html  (single self-contained file to share/open)
```

`npm run build` produces one `dist/index.html` you can double-click or send to someone.

## Stack

- **React + Vite** (builds to a single file via `vite-plugin-singlefile`).
- **GSAP** — the "analyzing" sequence, the Symptom Score gauge/count-up reveal, and
  the SOS breathing animation.
- **Lenis** — smooth scrolling on the paywall (`src/lib/smoothScroll.js`).
- **react-bits** (via jsrepo, `jsrepo.config.mjs`) — `SplitText` (headline reveals)
  and `GradientText` (the wordmark). Add more: `npx jsrepo add <Name>-JS-CSS --yes`.

## It's a prototype — no backend / no API

Everything is mocked client-side so you can click through:

- **Symptom Score** is computed locally in `src/lib/score.js` from the quiz answers.
- **Email** is captured in state only (not sent).
- **Purchase** is simulated (no Stripe / App Store).

Handoff points are single callbacks, ready to wire to real services later:
`Email → onSubmit(email)`, `Paywall → onPurchase(plan)`.

## Layout

```
src/
  App.jsx              funnel state machine + phone/stage chrome
  data/quiz.js         questions, promo slides, symptom domains
  lib/score.js         Symptom Score + domain breakdown
  lib/smoothScroll.js  Lenis + GSAP ticker
  screens/             QuizIntro, Quiz, Analyzing, SymptomScore, Email, Paywall, Home
  components/          Chrome (status bar, Button), reactbits/
  index.css           design system (warm, calm; Fraunces + Inter)
```

## Design direction (placeholder — to be refined)

Warm, calm, clinical-but-human: sand/cream surfaces, deep plum text, terracotta→berry
accent, serif display (Fraunces) + Inter. Large tap targets for the 45–60 demographic.
Tokens live at the top of `src/index.css`.
