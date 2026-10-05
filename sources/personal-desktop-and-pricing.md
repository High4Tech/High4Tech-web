# Personal desktop and pricing — 5 October 2026

Home is a visual agency launchpad with featured work, AI/pricing shortcuts, a recent blog and personal notes. Studio remains the separate team/process directory. The left desktop bento now includes a compact image-led Tools & resources ticket, with previous/next controls and a link to each resource's detail page.

## Pricing

The calculator groups builds into Web (WordPress, Shopify, Custom/Next.js, POS), App (Android, iOS, cross-platform) and AI & automation (workflows, knowledge chatbot, API connections). Scope, complexity, eligible add-ons and optional monthly support determine an itemised USD estimate. The contact action pre-fills the enquiry with the selected scope and estimate.

All amounts are **dummy planning rates**, not approved prices or a payment commitment. Edit `lib/pricing-calculator.ts` to replace them. Existing Payload Pricing records remain intact; the calculator rates are currently code-configured, not CMS editable. Hosting, domains, third-party services, AI usage and tax are excluded. Monthly support includes bounded hours and business-day response targets. Run `npm run pricing:verify` for pricing examples and input guards.

## Dock and personal files

Drag dock icons to reorder them. Keyboard alternative: focus an icon, hold Alt and press Left/Right. The browser saves the order in `h4t-dock-order-v1`. Toolkit uses a dedicated toolbox asset; Desktop uses a monitor; Trash uses a matching silver-bin asset. These two new SVGs are original additions styled to match the existing kit.

Personal notes, the studio guide document, the welcome marketing message and Newsroom cards can move to Trash using a Trash control or drag/drop onto the dock bin. Restore returns personal files and reveals hidden blog cards. This is **visitor-local storage**, capped at 100 files and 100 trash entries, under `h4t-desktop-files-v1`. It never deletes published Payload content. Emptying Trash discards personal items and returns hidden blog cards to the published library. Clearing browser storage resets this personal desktop.

## Let’s Scroll adaptation

Requested source: [AIwithhassan/lets-scroll](https://github.com/AIwithhassan/lets-scroll). Its skill and references are saved in `sources/skills/lets-scroll/`, with the upstream MIT license. `components/scroll-film.tsx` adapts the documented blob-video seek and queued-seek technique for Safari and AI Zone, including nested window scrolling, lazy loading, a progress line and pause/reduced-motion fallback. It uses the existing `/ai/neural-surface.mp4` film and poster; the existing Three.js globe remains in the AI hero.

No new scene chain was generated and no paid Monid/Higgsfield service was called. Small screens keep a landscape poster rather than pretending a crop is a purpose-built portrait camera flight. Creating a new cinematic camera journey would need an approved scene/camera plan and separate generation budget.
