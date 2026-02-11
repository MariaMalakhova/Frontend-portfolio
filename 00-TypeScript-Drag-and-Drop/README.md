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
- **esbuild** — Fast bundle for the browser
- **lite-server** — Local dev server

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

# Build and run (builds with esbuild, serves with lite-server)
npm start
```

Then open the URL shown in the terminal (usually `http://localhost:3000`).

**Build only:**

```bash
npm run build
```

Output is a single `dist/app.js` bundle loaded by `index.html`.

## License

ISC
