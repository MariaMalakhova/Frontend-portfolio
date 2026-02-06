# Placepicker — Side Effects & Effects Management

Interactive location picker demonstrating side-effect handling (geolocation, async logic) and effect cleanup.

## What it is

A small app where users can search for places, pick one, and see details. Focused on managing async effects, cancellation, and cleanup on unmount or query change.

## Features

- Simulated place lookup
- Geolocation permission flow (Browser Geolocation API)
- Clean effect cancellation on unmount or query change

## Tech

- React 19, React DOM
- Vite
- `useEffect` / side-effect patterns, Browser Geolocation API

## Run locally

From the repo root:

```bash
cd "11 Placepicker (Side Effects)"
npm install
npm run dev
```
