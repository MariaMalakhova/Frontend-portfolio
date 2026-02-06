# React SSR

Demo: React app with **server-side rendering** — Express renders on the server, route-based data loading via `loadData`, Redux state serialized and hydrated on the client.

## What it is

A multi-page app (Home, Users, Admins) with SSR, Redux for state, and API data loaded on the server before render.

## Features

- Server-side rendering with Express
- Route-based data loading
- Redux state serialization and client hydration
- React Router with react-router-config

## Tech

- React 16, React DOM
- Redux, Redux Thunk
- React Router, react-router-config
- Express
- Webpack (server + client bundles)
- React Helmet, Axios, Materialize CSS

## Run locally

From the repo root:

```bash
cd SSR
npm install
npm run dev
```

Open http://localhost:3000. Routes: `/`, `/users`, `/admins`.
