# Pawsway Road Atlas

A route planner for a cross-country move with pets. Pick a start and a destination, set how far you'll drive each day, and Pawsway:

- finds the shortest route over a network of ~125 US cities and interstate segments
- splits the drive into dated driving days with an overnight town for each night
- lists the pet-friendly hotel chains at each stop, filtered by your pets' type, number and weight
- totals the pet fees for the whole trip by chain
- links each stop to Google Maps and opens the full route with waypoints

**Live:** https://feynos-lin.github.io/pawsway/

It's a single static `index.html` with no backend and no API keys.

## Caveats

- The map is a schematic drawing and mileage is approximate (straight-line distance × 1.17). Overnights can only land on towns in the network.
- Pet fees are typical brand policies. Most hotels are franchised and set their own rules, so confirm with the specific property.

## Building

`index.html` is generated. To change cities, roads or styling:

```sh
cd build
npm install
npm run build   # regenerates data.json from build.mjs, then writes ../index.html
```

- `build/build.mjs` defines cities and interstate segments and projects the US map (us-atlas + d3-geo, Albers USA).
- `build/template.html` holds the page and the hotel-chain policy table (`CHAINS`).
- `build/assemble.mjs` inlines the data and wraps the page as a standalone document.
