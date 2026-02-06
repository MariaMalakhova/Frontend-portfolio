```md
# PlacePicker — Side Effects & Effects Management
 *(side-effects / maps / effects demo)*

Interactive location picker demonstrating side-effect handling (geolocation, async calls) and effect cleanup.

## What it is
A small app where users can search for places, pick one on a map, and see details. Focused on managing async effects, cancellation, and performance optimisations.

## Features
- Simulated/place API lookup
- Geolocation permission flow
- Clean effect cancellation on unmount or query change

## Tech
React, RTK Query or fetch, Leaflet or simple mock map

## Run locally
```bash
cd projects/{placepicker-side-effects}
npm install
npm run dev
