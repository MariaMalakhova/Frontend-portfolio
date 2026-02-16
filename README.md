# Frontend Portfolio — Demo Apps

A collection of React and TypeScript demo apps showcasing different concepts: state, refs, portals, side effects, forms, cart/checkout, server-side rendering, and full-stack projects.

---

## Apps

| App | Description | Tech | Status |
|-----|-------------|------|--------|
| **00 TypeScript Drag-and-Drop** | Project manager: add projects, assign people, drag & drop between Active/Finished lists | TypeScript, Vanilla DOM, Webpack | |
| **04 Tic Tac Toe Game** | Classic 2-player Tic Tac Toe with win/draw detection and move history | React 19, Vite | |
| **08 The Almost Final Countdown (Refs Portals)** | Timer/countdown with `useRef`, timeout cleanup, and React Portals for modals | React 19, Vite, Portals | |
| **11 Placepicker (Side Effects)** | Location picker with geolocation, async effects, and effect cleanup | React 19, Vite, useEffect / Geolocation API | |
| **13 React Quiz** | Timed quiz with per-question countdown, scoring, and summary | React 19, Vite | |
| **18 Food Order** | Food ordering UI: dish cards, cart, checkout form, and backend API | React 19, Context API, Vite; backend: Express | |
| **25 NextJS App (NextLevel Food)** | Food-sharing app: browse recipes, meal details, share meals; SQLite, server actions | Next.js 15, React 19, better-sqlite3 | |
| **Spending Tracker** | Personal finance: expenses, income, budgets, receipt OCR; dashboard and transaction management | React 19, TypeScript, Vite, Redux, MUI, Express | **🔄 Under development** |
| **SSR** | Server-side rendered React app with Redux, Express, and route-based data loading | React 16, Redux, Express, Webpack | |

---

## Run an app

Each app is self-contained. From the repo root:

```bash
cd "04 Tic Tac Toe Game"
npm install
npm run dev
```

Use the same steps for any other app — replace the folder name with the one from the table above.

- **SSR:** Same commands; app at http://localhost:3000 (routes: `/`, `/users`, `/admins`).
- **18 Food Order:** Run the frontend with `npm run dev`; run the backend from `18 Food Order/backend` with `npm start` (see that app’s README).
- **Spending Tracker:** Run the frontend with `npm run dev`; run the backend with `npm run server` (see that app’s README). *Under active development.*

---

## Structure

- Each folder is a standalone project with its own `package.json` and dependencies.
- Individual app READMEs live inside each folder for more detail.
