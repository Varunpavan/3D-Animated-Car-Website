# Apex Noir Cinematic Car Showcase

A production-style React + Vite luxury automotive landing experience using the provided 240-frame image sequence.

## Run

```bash
npm install
npm run dev
```

The frame manifest is generated automatically from `public/Frames` before dev and build.

## Build

```bash
npm run build
```

## Key Pieces

- `src/components/FrameSequence.jsx` handles scroll-synced canvas playback, image caching, frame blending, and GSAP chapter timing.
- `src/components/SceneChrome.jsx` adds the Three.js shader glow, particle atmosphere, bloom, chromatic aberration, and vignette.
- `scripts/generate-frame-manifest.mjs` detects and naturally sorts frames from `public/Frames`.
