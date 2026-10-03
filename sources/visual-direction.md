# High4Tech visual direction

Recorded: 2 October 2026. Status: confirmed brand constraints plus a proposed visual system for discussion.

## Confirmed brand and frontend requirements

- Brand: High4Tech.
- Primary color: `#F97328`.
- Secondary colors: `#000000` and `#FFFFFF`.
- Confirmed surface hierarchy: white dominates the website; black is an accent for typography, outlines, small controls, and limited graphic details. Orange remains the primary brand highlight.
- Custom-coded Next.js/React frontend with Three.js and GSAP.
- Use the supplied logos and the SVG containing two illustrated mascots.
- Preserve all supplied visual references as inspiration.
- Finalize the public-facing experience first. Backend and CMS decisions and implementation are outside this stage.
- Tools include free and paid offerings, with outbound links to their platforms. All purchasing happens there.

## Proposed direction

A confident creative technology agency with a predominantly white interface: oversized type, generous whitespace, large project imagery, orange highlights, restrained black accents, and a useful resource catalog. The Stōkt Heron case study adds an editorial, image-led reference. Keep sculptural effects as objects or contained visual moments within the light layout. Use Tkxel for clarity of services and proof.

This is a synthesis, not a replica of a single reference. High4Tech's identity should remain visible without importing another agency's colors, mascots, wording, client logos, or achievements.

## Palette and surfaces

Use white as the default surface for the hero, navigation surroundings, services, case-study reading areas, catalog, blog, contact, and footer. Use black for readable text, fine outlines, icons, selected small controls, and restrained graphic accents. Do not default the hero, services, or footer to full black backgrounds. Use the exact brand orange for calls to action, selected filters, small labels, and signature graphic objects. Broad orange or dark surfaces in references are inspiration for contained artwork, not the dominant interface. Neutral grays can support borders, secondary text, and disabled states; they are proposed utility colors, not additional brand colors.

Orange buttons should use black text. White text on this orange should not be the default for small labels. Verify contrast during the frontend draft. Project images may have their own colors, but the surrounding interface remains orange, black, and white. Avoid adopting Tkxel blue, Direct yellow/green, or Copula blue as new brand accents.

## Typography and layout

- Large editorial headlines with short phrases and deliberate line breaks.
- A legible sans-serif for navigation, body copy, forms, and article content; final font choice remains open.
- Small section numbers and category labels can add structure without overwhelming the page.
- Preserve the supplied wordmark's distinctive lettering. Do not replace it with typed text pretending to be the logo.
- Use a consistent grid, strong alignment, thin dividers, and spacious white sections. Create rhythm through image scale, type hierarchy, layout, and orange accents rather than alternating dark sections.
- Let case studies dominate through imagery, not dense repeated decorative cards.
- Use restrained corners for standard cards; rounded badges or pills only where they serve the design.

## Brand asset handling

The favicon and wordmark are raster originals. Preserve their original proportions and backgrounds. The mascot SVG is a 1536 x 1024 composition containing two monochrome illustrated heads: one with a beanie and a wink, one with sunglasses and a beard. It contains approximately 1,630 paths, so it is not a simple facial-animation rig or a ready-made 3D model.

Suggested mascot roles: an agency/about moment, a small chatbot identity, a friendly empty state, and a contact sign-off. Begin with modest group movement, translation, rotation, or a reveal of the original composition. If separate heads, transparent variants, facial deformation, or 3D models are needed, create derived assets later while retaining the originals. Do not promise that the supplied SVG already supports those uses.

The 3D hero can use a sculptural interpretation of the High4Tech mark as a proposed direction; it must be built as a derived visual and should not distort the permanent navigation logo.

## Motion direction

| Moment | Proposed behavior | Role |
| --- | --- | --- |
| Hero | One slow orange sculptural object with restrained black details on a white/light field; subtle pointer response | Three.js through React Three Fiber |
| Hero copy | Short staggered line reveals; CTA available immediately | GSAP |
| Section entry | Restrained fades or positional reveals | GSAP |
| Work cards | Small image scale and arrow movement on hover/focus | GSAP or simple CSS |
| Process | Step highlighting as the visitor moves through the section | GSAP/ScrollTrigger |
| Logo feature | Optional short liquid treatment in a decorative section | Liquid Logo inspiration |
| Background | Optional contained orange/white shader accent preserving the predominantly white page | ShaderGradient candidate |
| Mascots | Small group movement in a few relevant places | SVG and GSAP |

Three.js handles rendered scenes; GSAP coordinates timing and page movement. A single prominent visual idea per section is preferable to simultaneous effects everywhere. ShaderGradient and Liquid Logo are candidates to evaluate, not mandatory dependencies.

Keep normal scrolling and standard navigation. No required intro sequence, scroll hijacking, cursor-only actions, or prolonged loading screen. Pointer effects must be optional on touch screens. Text, navigation, and CTAs remain regular accessible page elements.

## Responsive and accessibility rules

- Recompose oversized headings for mobile; do not clip essential words.
- Stack project cards and service layouts as space narrows.
- Keep hover information available on touch and keyboard focus.
- Respect reduced motion; replace continuous decorative animation with static alternatives.
- Provide a static hero fallback if 3D rendering is unavailable or too expensive.
- Lazy-load decorative effects, pause offscreen rendering, and avoid multiple full-page canvases.
- Use native buttons/links, visible focus states, meaningful alt text, and labeled form fields.
- Avoid automatic carousels for essential content; provide direct controls for any carousel used.

## Content consistency

Use real High4Tech projects and approved business information. Do not generate clients, testimonials, certifications, awards, project results, prices, business hours, or response-time promises. Existing-site statistics conflict between sections and need confirmation before reuse. Use visible draft placeholders where necessary.

The current site positions High4Tech as a design and development agency. Broader SEO/marketing services appear in the user's initial blueprint, but their exact names and deliverables still need confirmation. Do not borrow reference agencies' service menus as if they were High4Tech's offerings.

## Reference hierarchy

1. User-confirmed white-dominant surface hierarchy, brand palette, and original logo/mascot assets.
2. Stōkt Heron, Fahrenheit, MadamePolare, and the lighter Direct compositions for editorial spacing, image-led storytelling, and type hierarchy.
3. Attached 3D agency screenshot for sculptural objects and project imagery, adapted to white surfaces.
4. Attached Tkxel screenshot and Marino for service hierarchy and credibility sections.
5. Copula and Displace for selective typographic or interactive personality, adapted to High4Tech's white-dominant interface.

Detailed evidence and source URLs are in [Website references](references/websites.md). This hierarchy is a proposed interpretation of the references, not a user-approved ranking.

## Current landing implementation

The landing page now uses one contained black bento module as the visual counterweight to the white page. It groups services, motion language, mascot artwork, availability, and the working toolchain (Next.js, React, Three.js, GSAP, Payload, Figma, and Vercel) into compact cards. Cards reveal with GSAP as the section enters, while the orbit, spark, tool chips, and service rows carry small, low-noise motion. The black module stays an accent surface; the overall page remains white-led with High4Tech orange reserved for emphasis.

## Studio-first update — 2 October 2026

This update supersedes the standalone landing-page layout above. `/` now opens the studio directly, with Home open by default. `/desktop` is the desktop route. All public content remains reachable through the dock, Finder sidebar, and its existing URLs.

- Boot: original High4Tech mark and restrained progress animation.
- First visit: five-step, skippable tour; replay from Help. Completion stored locally.
- Home: settings-style grouped services, projects, process, resources, journal, FAQs, and contact. A contained black studio bento preserves the Stokt reference direction.
- Desktop: corner-aligned live widgets, local/London clocks (not claimed office locations), dynamic calendar, journal and counts from the content catalog. Welcome note and help sit directly below.
- Appearance: system UI font stack, softer wave wallpaper, original wordmark, clear glass dock with rim highlights. Shared surface/text tokens cover light and dark states.
- Mascots: first original face in the assistant; second follows the pointer only over desktop background. Disabled on touch and for reduced motion.
- Loops: tools above the workspace and existing portfolio client names above the dock; no invented client logos or endorsements.
- Music: three original synthesized ambient loops, default Soft Focus, starting after interaction. Pause, next, track selection and volume work locally. Spotify and Apple Music accept shared links and load official embedded players; personal account/library authorization is not connected in this frontend phase. External playback is controlled by the provider and may require sign-in/subscription.
- Sound: short original synthesized interface tones for clicks, app openings and window controls; not extracted Apple system audio.
- Existing contact, calendar, and assistant remain explicitly labeled frontend previews.

Reference: https://displace.agency/ and user-supplied screenshots. Spotify embed guidance: https://developer.spotify.com/documentation/embeds . No third-party site code or private assets copied.

## Latest studio direction — 3 October 2026

See [studio-assets-and-behavior.md](studio-assets-and-behavior.md) for current app mappings, Figma icon provenance, sound assignments, same-window sidebar navigation, Newsroom, AI Zone, sample Pricing, and Play. These decisions supersede earlier landing-first and music-autoplay notes.

The tools loop is restored at the top, using the same original tech logos as Toolkit. The client loop is centered with the bottom dock, with no “In good company” label. Remove the desktop welcome/help card and bottom shortcut/folder hint. Music stays paused until a visitor chooses to play it. Payload integration begins in a later task after this frontend is pushed.
