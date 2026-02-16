# Spending Tracker

![Status](https://img.shields.io/badge/status-under%20development-orange)
> 🚧 This project is currently under active development.
> Features and structure may change.

A full-stack personal finance app for tracking expenses and income, managing budgets, and scanning receipts with OCR.

## Features

- **Dashboard** — Overview of spending, income, and recent activity
- **Transactions** — Add, edit, and delete income/expense entries with categories
- **Scan** — Upload receipt images and extract text via OCR (Tesseract.js)
- **Budgets** — Set and monitor spending limits by category
- **Settings** — App preferences and configuration
- **Receipt storage** — Attach receipt images to transactions; stored on the backend

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, TypeScript, Vite 7, React Router 7 |
| **State** | Redux Toolkit |
| **UI** | Material UI (MUI) 7, styled-components |
| **Feedback** | notistack (toast notifications) |
| **OCR** | Tesseract.js (receipt text extraction) |
| **Backend** | Node.js, Express, body-parser |
| **Data** | File-based (JSON + disk for receipts) |

## Project Structure

```
SpendingTracker/
├── src/
│   ├── app/           # Store, theme, global config
│   ├── features/      # Dashboard, transactions, scan, budgets, settings
│   ├── routes/        # App shell, router
│   └── shared/        # Reusable UI (Sidebar, ConfirmDialog, Toast)
├── server/            # Express API (transactions + receipt uploads)
│   ├── data/          # transactions.json, receipts/
│   └── README.md      # API and run instructions
└── package.json
```

## Getting Started

**Prerequisites:** Node.js (v18+ recommended)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the app**

   - **Frontend (Vite):** `npm run dev` — dev server (e.g. http://localhost:5173)
   - **Backend (Express):** `npm run server` — API at http://localhost:3000

   For full functionality, run both in separate terminals. The frontend is configured to talk to the backend at `http://localhost:3000`.

3. **Build for production**

   ```bash
   npm run build
   npm run preview   # optional: preview production build
   ```

## Backend & API

The Express server provides REST endpoints for transactions and receipt uploads. Data is stored in `server/data/transactions.json` and receipt images in `server/data/receipts/`.

See **[server/README.md](server/README.md)** for API details, endpoints, and data format.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build |
| `npm run server` | Start Express backend |
| `npm run lint` | Run ESLint |

---

Part of my portfolio — built with React, TypeScript, and Express.
