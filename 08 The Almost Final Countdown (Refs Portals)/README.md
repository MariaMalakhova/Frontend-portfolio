# The Almost Final Countdown

Demo focusing on advanced React patterns: `setTimeout` handling, `useRef` for mutable values, and React Portals for UI overlays.

## What it is

Timer/countdown component demonstrating robust timeout management, cleanup, and UI composition using portals.

## Features

- Start / pause / reset countdown
- Accurate tick handling using `useRef` to avoid stale closures
- Modal/overlay implemented with React Portal (`createPortal`)
- Accessible controls & keyboard support

## Tech

- React 19, React DOM
- Vite
- React Portals (via `react-dom`)

## Run locally

From the repo root:

```bash
cd "08 The Almost Final Countdown (Refs Portals)"
npm install
npm run dev
```
