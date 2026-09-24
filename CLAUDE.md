@AGENTS.md

# j.gut illustration portfolio

Portfolio site for José Gutierrez (j.gut), concept artist. Goal: land commissions and studio applications (Riot and similar). The site is a **visual container**, not the full catalogue (Instagram covers that): a cinematic scroll-driven hero, then a light gallery of 5 illustrations, then contact. English UI. The user talks to Claude in Spanish.

Confirmed intent: `docs/intent/portfolio.md`. Approved plan: `~/.claude/plans/tenemos-un-nuevo-proyecto-wondrous-stroustrup.md`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger (+ Flip) + `@gsap/react` · Lenis · Canvas 2D · sharp (scripts only) · Vitest · Vercel.
Next 16 differs from older versions: read `node_modules/next/dist/docs/` before using an API you are unsure about.

## Commands

- `npm run dev` — dev server (`.claude/launch.json` → `portfolio-dev`, port 3000)
- `npm run build` · `npm run lint` · `npm run typecheck` · `npm test`
- `npm run optimize:frames` — `assets-source/frameN.jpg` → `public/hero/frameN.webp`

## Conventions

- Hero is **data-driven**: frames, copy and scroll ranges live in `lib/hero/config.ts`. José may later replace the AI-generated frames with his own, so never hard-code frame logic in components.
- Pure animation maths lives in `lib/hero/timeline.ts` (unit-tested); drawing lives in `lib/hero/renderer.ts`.
- Text over the hero is real HTML (sharp, accessible), never drawn into the canvas.
- Fonts: Unbounded (display) · Shippori Mincho (vertical kanji, glyph-subset, self-hosted) · JetBrains Mono (cryptic HUD text) · DM Sans (light section).
- Colours (tokens in `app/globals.css`): ink `#07070d`, paper `#f6f1e9`, vermilion `#e5233b`, fog `#8b88a0`.
- Logo: `components/Logo.tsx` (inline SVG, `currentColor`) from `lib/logo.ts`; standalone `public/logo.svg`; favicon `app/icon.svg`.
- Originals (frames, logo) stay untouched in `assets-source/`.
- Any Japanese copy must be reviewed by a native speaker before launch.

## Git workflow (checkpoints)

- `main` only holds **states the user approved**. Work happens on `feat/<name>` branches with small Conventional Commits (`feat(hero): …`); commits end with `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.
- When the user approves a checkpoint: merge `--no-ff` into `main`, create an annotated tag `checkpoint-NN-<slug>`, push `main` and the tag.
- If a change isn't liked: drop the branch (`git switch main && git branch -D feat/x`). To go back after a merge: `git revert`, or `git reset --hard <tag>` **only with explicit confirmation** (destructive).
- Only commit/push when the user asks or approves a checkpoint. Never `--force`, never `--no-verify`.
- Every branch gets a Vercel preview URL; `main` is production.
