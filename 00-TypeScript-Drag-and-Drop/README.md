# Project Manager — Drag & Drop

A small project management app built with **TypeScript**. Add projects, assign people, and move items between Active and Finished lists using native HTML5 drag and drop.

## Features

- **Add projects** — Title, description, and number of people (with validation)
- **Drag & drop** — Move projects between Active and Finished lists
- **State management** — Single source of truth with listeners for reactive UI updates
- **Component-based UI** — Reusable base component and project-specific components

## Tech Stack

- **TypeScript** (strict mode, decorators)
- **Vanilla DOM** — No framework; template-based rendering
- **Webpack** — Bundle (ts-loader) and dev server

## Project Structure

```
src/
├── app.ts                 # Entry point
├── components/            # UI components
│   ├── base-component.ts  # Abstract base for DOM components
│   ├── project-input.ts   # Form to add projects
│   ├── project-item.ts    # Single project (draggable)
│   └── project-list.ts    # Active / Finished list (drop target)
├── state/
│   └── project-state.ts   # Singleton state + listeners
├── types/
│   ├── drag-drop.ts       # Draggable & DragTarget interfaces
│   └── project.ts         # Project model & PROJECT_STATUS
└── util/
    ├── decorators.ts      # @Autobind
    └── validation.ts      # Form validation helpers
```

## Getting Started

**Prerequisites:** Node.js and npm.

```bash
# Install dependencies
npm install

# Run dev server (Webpack dev server with live reload)
npm start
```

Then open the URL shown in the terminal (e.g. `http://localhost:8080`).

**Production build:**

```bash
npm run build
```

Output is written to `dist/` and loaded by `index.html`.

## License

ISC
