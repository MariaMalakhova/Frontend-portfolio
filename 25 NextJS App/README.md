# NextLevel Food

A Next.js food-sharing app where users can browse recipes, view meal details, and share their favorite meals with the community.

## Features

- **Home** — Hero section with image slideshow and links to community and meals
- **Explore Meals** — Browse all shared meals with loading states and error handling
- **Meal Details** — View full recipe (title, summary, instructions, creator) for each meal
- **Share a Meal** — Submit a new recipe with title, summary, instructions, and image (server actions)
- **Community** — Info page about community perks (recipes, friends, events)

Data is stored in SQLite. User-submitted instructions are sanitized with XSS protection, and meal slugs are generated with `slugify`.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **better-sqlite3** — SQLite database
- **slugify** — URL-friendly slugs for meals
- **xss** — Input sanitization for instructions

## Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)

## Setup

1. **Clone and install**

   ```bash
   cd "25 NextJS App"
   npm install
   ```

2. **Initialize the database**

   Creates `meals.db` and seeds it with sample meals:

   ```bash
   node initdb.js
   ```

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Build for production     |
| `npm run start`| Start production server  |
| `npm run lint` | Run ESLint               |

## Project Structure

```
├── app/                    # App Router pages & layouts
│   ├── community/          # Community page
│   ├── meals/              # Meals list, detail [mealSlug], share
│   ├── layout.js
│   ├── page.js             # Home
│   └── globals.css
├── components/              # Reusable UI (header, meals grid, image picker, etc.)
├── lib/                     # Data & server actions
│   ├── meals.js            # DB queries (getMeals, getMeal, saveMeal)
│   └── action.js           # shareMeal server action
├── assets/                  # Static images & icons
├── initdb.js               # DB schema + seed data
├── meals.db                # SQLite DB (created by initdb.js)
└── public/                 # Served static files (e.g. uploaded meal images)
```

## Database

- **File:** `meals.db` (SQLite)
- **Table:** `meals` — `id`, `slug`, `title`, `image`, `summary`, `instructions`, `creator`, `creator_email`
- **Seed:** Run `node initdb.js` once to create the table and insert sample meals. Re-running will insert duplicates; clear or delete `meals.db` first if you want a fresh seed.

## License

Private — for learning/portfolio use.
