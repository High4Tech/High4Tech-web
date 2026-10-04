# AI Zone — visual direction and implementation

Reference reviewed: [Armory](https://armory.framer.ai/) and the supplied 31-second website recording. The page alternates a dark hero and technical workflow surfaces with light editorial services, ideas, and FAQ sections. Large, bold PP Neue Montreal headings and Helvetica Neue descriptions, restrained labels, thin dividers, and orange accents carry High4Tech's branding.

The supplied `9PJB6pimDu8LsjZi85rDKOpOc.mp4` is used as an optimized, muted film in the prominent cinema panel and approach section, shared with Safari. It is paused out of view and for reduced-motion visitors. The website recording is a study reference, not a shipped asset.

## Interactive globe

- [Globe.GL](https://github.com/vasturiano/globe.gl), MIT, uses Three.js/WebGL. The [submarine cables example](https://globe.gl/example/submarine-cables/) informed the Earth texture, animated paths, and interaction.
- Earth textures are bundled locally from the MIT-licensed [three-globe example assets](https://github.com/vasturiano/three-globe/tree/master/example/img).
- Connection paths are original illustrative data. They are not live submarine-cable records, office locations, client locations, or monitored network traffic.
- A static SVG fallback was generated using [Natural Earth's public-domain land geometry](https://www.naturalearthdata.com/about/terms-of-use/). The original 110m geometry is kept alongside the assets.
- Rendering starts on visibility, pauses while hidden/minimized, resizes with its panel, and disposes on unmount. Reduced motion disables automatic movement; visitors can also pause motion or reset the view.

## Content and interactions

Six initial service entries use the existing Payload `ai-services` fields. Existing edited content is preserved. The globe and workflow explorer are presentation components; sample workflows do not send messages or connect accounts.

Three examples cover leads, documents, and knowledge questions. Tabs, step selection, and a timed run demonstrate the sequence. Services expand into deliverables. FAQs use accessible native disclosure controls. Contact, pricing, and assistant actions open the studio's existing apps.

The AI evolution copy describes connected tools and supervised workflows without fabricated performance figures or invented client endorsements. Background reading: [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents).

GSAP supplies entrance/reveal motion. All layout styles are scoped to AI Zone; container queries adapt to the actual studio-window width rather than only the browser viewport.

4 October refinement: the hero centers the globe's upper hemisphere above a centered, bold PP Neue Montreal headline and Helvetica description. The clipped square renderer is bounded at 1080px; pause/reset controls stay outside the masked globe surface. Section content is capped at 1280px while backgrounds fill the studio pane. The hero copy is capped at 860px. Narrow windows stack cards, the approach section, and FAQ columns.

The current campaign adapts the MIT [Agency-AI template](templates/README.md): centered “Less busywork. More possibilities.” hero, a large film panel, light expandable service cards with pointer spotlights, a framed workflow demo, and consistent editorial rails. The original CMS service data and workflow interactions are retained. Films include manual playback controls.
