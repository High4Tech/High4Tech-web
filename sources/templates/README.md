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

## Inner studio app layouts

Selected on 4 October 2026: [Shadcn Dashboard](https://github.com/shadcndashboard/shadcndashboard), reviewed at `386235c3199168fa743db593d7acf014a40f1ca1`. Its [MIT license](shadcn-dashboard/LICENSE.txt) is preserved. Reviewed the blog listing/featured card and user-profile workspace source. Editorial featured-story hierarchy, compact navigation and profile-panel organization inform the inner studio apps. This is a pattern adaptation into our existing React/CSS components, not a dependency on the dashboard application. No template images, statistics, client claims or business copy were imported.

- Newsroom: featured editorial story, topic filters, reading cards and bounded article typography.
- Projects: image-forward grid/list library, categories/search and case-study metadata.
- Expertise: expandable discipline rows, deliverables and related-work details.
- Studio/Home: original mascot identity, content-driven directory, principles, project/resource shortcuts and FAQs.
- Pricing: selectable package workspace, comparison table and clearly marked sample prices.
- Shared neutral light/dark surfaces, orange focus states, supplied fonts, window-scoped Lenis/GSAP and responsive content gutters. Toolkit tiles use the same `studioStack` as the desktop loop.

Desktop Newsroom cards support left/right drag, arrow buttons and arrow keys. The actual assistant greeting appears once per tab session after 30 seconds in the app; dismissing it starts a separate 30-second countdown for the pricing reminder. Visiting the assistant or pricing app avoids duplicate invitations. Hidden tabs do not display prompts until visible. Opening the greeting never creates a visitor profile or submits a chat message.

Implementation: `components/inner-pages.tsx`, `components/newsroom-stack.tsx`, `components/visitor-prompts.tsx`, `components/studio-sections.tsx`, `app/inner-pages.css`. All content continues to read the existing CMS; private data and database files are untouched.

## Newsroom, Expertise and Tools revision — 4 October 2026

Expertise now adapts [Magic UI Bento Grid](https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/bento-grid.tsx), reviewed from upstream `main` on 4 October 2026. Its [MIT license](magicui/LICENSE.txt) is preserved. The asymmetric grid, visual-led service panels and hover transitions informed our own CSS/React component; the whole template and its dependency stack were not imported. Brand design specimens, code panels and the service orbit are original artwork, not third-party business claims.

Newsroom was completely rebuilt as an image-led editorial publication: oversized masthead, category tabs, lead story, reading desk and image cards. Detail pages have distinct banners, a narrow reading column and optional inline image captions. This supersedes the prior featured-card implementation. Home highlights the latest dated published article with a Recent blog badge. Undated articles retain CMS order.

Tools & Resources is a neutral storefront inside the existing folder window, with platform counts in white badges, image previews, purpose search, Free/Paid filters, and existing consent-to-load YouTube demos on detail pages. Paid tools offer an explicitly illustrative checkout and animated thank-you. No payment, order, entitlement or customer data is saved by that demo; actual access and purchases remain on external tool platforms.

Contact CTAs open `/contact` directly with the existing fillable inquiry form. `/mail` keeps the welcome inbox separate. Calendar uses a month grid and transfers a requested date/topic to Contact; without a booking provider this is a preference, not a reservation. The floating assistant stays in the bottom-right, minimizes to its mascot and expands into the main Assistant app.

New original runtime artwork: `public/editorial/*` (separate card and wide-banner compositions) and `public/tools/*` (tool preview graphics). Uploaded CMS media takes precedence. New CMS fields and their additive production migration preserve existing content and legacy Newsroom images. Implementation: `components/newsroom.tsx`, `components/expertise-workspace.tsx`, `components/contact-workspace.tsx`, `components/resource-browser.tsx`, `app/studio-refinement.css`.
