*(timeouts, refs and portals demo)*

```md
# The Almost Final Countdown

Demo focusing on advanced React patterns: `setTimeout` handling, `useRef` for mutable values, and React Portals for UI overlays.

## What it is
Timer/countdown component demonstrating robust timeout management, cleanup, and UI composition using portals.

## Features
- Start / pause / reset countdown
- Accurate tick handling using `useRef` to avoid stale closures
- Modal/overlay implemented with React Portal
- Accessible controls & keyboard support

## Tech
React, Vite, React Portals

## Run locally
```bash
cd projects/{almost-final-countdown}
npm install
npm run dev
