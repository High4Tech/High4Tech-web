# High4Tech — first public website draft

Custom Next.js / React / TypeScript frontend with Three.js (React Three Fiber) and GSAP. Predominantly white, orange `#F97328`, black typography and accents. Unbounded headings with an Apple-style system font stack for descriptions and labels.

## Run locally

Use Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:3000`. Production checks: `npm run typecheck` and `npm run build`. To preview a completed build: `npm run start`.

## Pages

- Home `/`
- Services `/services` and three service details
- Portfolio `/projects` and two case studies
- Toolbox `/tools-and-resources`, with search and free/paid/category filters
- Studio `/about`
- Journal `/blog` and three draft articles
- Contact `/contact`
- Preview policy pages `/privacy` and `/terms`
- Custom missing-page screen

## Interaction direction

The 3D orange four slowly moves and responds to the pointer. A shader reveals its wireframe inside an inspection lens. The X-ray button exposes the full wireframe for touch and keyboard users. The pause button stops motion. Rendering pauses when the hero leaves the viewport. Reduced-motion preferences suppress motion and the custom cursor.

Contextual cursor labels appear over work, resources, the mascots, and actions. Inputs keep the native cursor. Navigation and controls remain usable without custom cursors or WebGL.

## First-draft boundaries

There is no CMS, database, backend, admin panel, payment gateway, or live AI integration. Tools open their own platforms. The assistant gives local scripted replies. Booking shows a clear preview and schedules nothing. The contact form validates and prepares an inquiry for the user's email app; it does not send messages itself or persist data.

The paid-tool slot awaits the real product names and platform links. Three original editorial draft articles demonstrate the journal. The digital-growth service outline needs confirmation. Case-study images come from the current High4Tech portfolio; no performance claims or invented testimonials are used. Policy pages are preview notices awaiting the final integrations. Preview metadata is set to noindex.

## Content and references

`lib/content.ts` holds editable draft text and links. `sources/` preserves the approved direction, original assets, reference websites, repository links, and provenance. Brand assets in `public/brand/` include the supplied mascot artwork and favicon, plus a cropped copy of the supplied wordmark. The originals remain in `sources/assets/`.

Display font: Unbounded, packaged locally with Fontsource under OFL-1.1. Body: native platform fonts. GSAP controls subtle reveals. ShaderGradient and Liquid Logo are explored references and linked community resources, not dependencies in this draft.
