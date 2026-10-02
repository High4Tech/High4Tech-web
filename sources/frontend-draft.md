# First frontend draft — 2 October 2026

The user authorized the first custom-coded draft after collecting the brand and visual references. This file records implementation decisions for the next revision.

## Direction carried into the draft

- White is the dominant page surface. Black is typography, outlines, small selected-filter states, and the compact assistant launcher. Orange `#F97328` is the highlight.
- Unbounded 700/900 provides wide retro-futuristic headlines. Descriptions, tags, controls, and metadata use the Apple-style native system font stack. Fonts do not load from a third-party font server.
- Large editorial type, an orange sculptural four, a generous grid, project imagery, fine dividers, and light backgrounds translate the references into a High4Tech visual direction.
- The supplied wordmark, favicon, and two mascot illustrations carry the agency identity. Original assets remain unmodified in this folder. The public wordmark is a crop of the provided square image.
- The Stōkt Heron reference informs the case-study direction: a substantial visual cover, succinct project metadata, spacious narrative, and a next-project transition. The supplied orange agency reference informs the hero and work presentation; its dark sections are not used as our default.

## Public experience implemented

Home, Services and three details, Projects and two details, Tools & Resources, Studio, Journal and three draft articles, Contact, preview notices for Privacy and Terms, and a missing-page screen.

The orange four uses Three.js through React Three Fiber. Custom shaders expose its wireframe within a pointer inspection lens. The full X-ray button also supports keyboard and touch use. The pause control stops animation, reduced-motion preferences suppress it, and the canvas stops continuous rendering outside the viewport. A CSS sculpture remains available without WebGL.

GSAP provides subtle entrance and scroll movement. Contextual cursor labels change over work, resources, mascots, and calls to action. Native cursors remain on input fields; custom cursors are disabled at phone widths, for coarse pointers, and for reduced-motion preferences.

Project, journal, and resource filters work locally. Resource search includes a resettable empty state. Navigation works on desktop and phone widths. FAQs expand and collapse.

## Honest preview boundaries

No CMS, database, admin panel, payment gateway, or real chatbot service was initialized. The assistant uses local scripted responses. The booking dialog schedules nothing and says so. The contact form validates and prepares an editable inquiry for the user's email app; nothing is automatically sent or stored on a server.

Tools open their own platforms for use, pricing, purchase, accounts, and support. Three free community resources illustrate the catalog. The paid-tool slot is explicitly a placeholder pending the user's real product links.

The two selected portfolio images were bundled from the current agency website. Source URLs and provenance are in `assets/current-site/manifest.json`. No client outcome statistics, testimonials, certifications, or awards were invented. Full case narratives await confirmation. Digital growth remains a proposed service outline. Three original short articles are editorial previews for review. Policy notices await the eventual live integrations.

Preview metadata uses noindex. Public launches should replace preview content, verify the agency contact links, and set production indexing only when authorized in the appropriate phase.

## Verification

- TypeScript check passed.
- Optimized production build passed; all 17 intended page paths prerendered, plus framework missing-page output.
- Desktop browser at 1280px: typography loaded, 3D scene rendered, no console errors observed, contextual pointer and shader lens revealed wireframe.
- Full X-ray control changed the sculpture to wireframe on desktop and phone-width layouts.
- Resource filters returned three free entries and one paid placeholder; search showed an empty state and reset restored all entries.
- Portfolio filter returned the expected app project; the case-study link opened its detail page.
- Discovery-call dialog carried a selected interest into the inquiry form and clearly stated that no meeting was scheduled.
- Required inquiry fields blocked empty submission. A populated draft preserved the chosen interest and created the expected email address, subject, and message.
- Mobile navigation opened, routed to a selected page, and closed. Service details and an article rendered without overflow. FAQ expansion displayed the expected answer. Back-to-top worked after increasing footer clearance above the floating controls.
- Homepage and Services were checked at 320px with document width equal to client width after the service-row correction. Other key pages were reviewed at 390px and 320px.

The browser checks exercised a desktop browser at phone widths. Actual physical devices, network delivery, real calendar/email/AI integrations, and CMS workflows are outside this first-draft verification.
