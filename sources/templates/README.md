# Campaign template adaptation

Selected on 4 October 2026: [Agency-AI](https://github.com/elyse502/agency-ai), an MIT-licensed React agency template. [Live demo](https://agencyai-opal.vercel.app/). Reviewed revision: `b6cdf1688775cb4bddfea2862cc01cfb3daf8980`. The original [MIT license](agency-ai/LICENSE.txt) is preserved.

Reviewed Hero, Title, Services, ServiceCard and OurWork. The centered hero, framed media, services and portfolio sequence inform the new Safari and AI Zone campaigns. ServiceCard's pointer spotlight is adapted into a passive pointer handler with CSS properties, avoiding React renders on every movement. The implementation stays inside the existing Next.js/Payload app, using its CMS data, Lenis and GSAP rather than the template's whole application or motion dependencies.

Safari combines white editorial sections, supplied bold PP Neue Montreal and Helvetica Neue, project photography, an orange motion film and a black service/tool bento. Keycap artwork and graphic motifs are original CSS/SVG compositions. AI Zone combines the existing interactive Globe.GL hemisphere, the supplied film, light expandable service cards, the existing workflow explorer, ideas and FAQs. No template client claims, team portraits, statistics or stock images are imported.

Cruip Open was reviewed but not incorporated. Stōkt and Armory remain visual references; their source/assets were not imported in this refinement. Satus remains the scroll-clock architectural reference.

## Media and behavior

- Both campaigns use the optimized user-supplied `public/ai/neural-surface.mp4` and its poster. Existing asset provenance remains in `public/ai/ATTRIBUTION.md`.
- Films are muted, load/play on visibility, pause out of view or while the document is hidden, and offer a manual pause/play control. Reduced-motion visitors start with a still poster and may explicitly play.
- The interactive globe keeps its locally bundled textures, original illustrative paths, drag, pause/reset and static fallback.
- Desktop content rails cap at 1280px; typography and layouts respond to the actual studio pane. Safari's links open the existing apps; section links stay inside its preview.
- CMS edits and private data remain intact. The campaigns read existing public content; there is no template CMS migration.

Implementation: `components/landing-campaign.tsx`, `components/ai-zone.tsx`, `components/campaign-media.tsx`, `app/campaigns.css`. The retired `landing-v2.tsx` has been removed. License/source notes belong in this folder when further template material is adapted.
