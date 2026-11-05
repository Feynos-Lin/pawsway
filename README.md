# Pawsway Road Atlas

A route planner for a cross-country move with pets. Pick a start and a destination, set how far you'll drive each day, and Pawsway:

- finds the shortest route over a network of ~125 US cities and interstate segments
- splits the drive into dated driving days with an overnight town for each night
- lists the pet-friendly hotel chains at each stop, filtered by your pets' type, number and weight
- totals the pet fees for the whole trip by chain
- links each stop to Google Maps and opens the full route with waypoints

**Live:** https://feynos-lin.github.io/pawsway/

It's a single static `index.html` with no backend and no API keys.

## Downloads

Grab the latest build from [Releases](https://github.com/Feynos-Lin/pawsway/releases/latest):

| Platform | File |
|---|---|
| Android | `Pawsway-<version>.apk` |

Linux (.rpm) and Windows builds were published with v1.0.0 only and are no longer updated.

Links to Google Maps open in your Maps app or default browser.

### Releasing

Push a tag (`git tag v1.0.1 && git push origin v1.0.1`) or run **Build and release** from the Actions tab with a version number. The workflow builds the APK and publishes the release. Android builds are signed with the `ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` and `ANDROID_KEY_PASSWORD` repository secrets when present (debug-signed otherwise).

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
- `android/` is the WebView wrapper (APK). `desktop/` is the Electron wrapper used for the v1.0.0 Linux and Windows builds; it is not built anymore.
