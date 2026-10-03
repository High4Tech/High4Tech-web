# High4Tech public website structure

Recorded: 2 October 2026. Status: proposed structure for the next discussion. Confirmed requirements are distinguished from suggested additions.

## Visitor goals

Understand what High4Tech does, judge the quality of its work, explore useful tools, read insights, and start a conversation or book a discovery call.

## Proposed sitemap

| Route | Status | Public-facing contents |
| --- | --- | --- |
| `/` | User-requested | Agency introduction, featured work, service overview, proof, resources, and booking |
| `/services` | User-requested | Service directory, agency approach, relevant work, and contact CTA |
| `/services/[slug]` | User-requested | Specific service, deliverables, process, related work, FAQs, and booking |
| `/tools-and-resources` | User-requested | Searchable/filterable free and paid tools with external source links |
| `/projects` | User-requested | Visual project directory with category filters |
| `/projects/[slug]` | Suggested addition | Complete project case study |
| `/blog` | User-requested | Articles, agency updates, and a secondary social-post area |
| `/blog/[slug]` | Suggested addition | Individual article with reading layout and related content |
| `/about` | Suggested addition | Agency story, principles, people/mascots, and verified credibility |
| `/contact` | Suggested addition | Inquiry form, booking, WhatsApp, email, and social links |
| `/privacy` and `/terms` | Suggested footer destinations | Appropriate public policy pages; final copy outside the visual draft |
| Unmatched route | Suggested standard behavior | Helpful 404 with routes back to work, services, or home |

`/checkout` is removed from the working proposal because all tool purchases happen on external platforms. A future agency-service payment flow would be a separate scope change. Dedicated resource detail pages are optional later; direct catalog-to-platform links are sufficient for the first draft.

## Global interface

- Header: brand mark, Services, Projects, Tools & Resources, About, and a primary Book a Call action. Keep Blog accessible through navigation; adjust grouping if desktop space is limited. Mobile gets a clear menu.
- Footer: full navigation, contact details, approved social links, policy links, and copyright.
- WhatsApp: a labeled floating action available throughout, positioned so it does not collide with chat or mobile controls.
- Chatbot: a compact launcher with an illustrated mascot option; close/minimize, suggested questions, message field, pending-response appearance, unavailable/error state, and human-contact fallback.
- Booking: Book a Call entry points on home, service details, and contact. Show a booking panel or section plus an external booking link fallback.
- Visible focus states, navigation active states, and a useful 404.

For the first draft, chatbot replies are clearly identified demo responses, booking uses a placeholder until the real URL is confirmed, and forms demonstrate validation and an honest preview state. Do not claim a form submission was delivered or a meeting booked without a live integration. This stage designs the experience only.

## Homepage sequence

1. **Hero:** White-dominant surface, High4Tech positioning in black type, a concise outcome statement, a signature orange 3D visual with restrained black accents, primary Book a Discovery Call CTA, secondary Explore Our Work CTA.
2. **Proof strip:** approved client marks or verified facts; omit unsupported logos and numbers.
3. **Selected work:** 3-4 large visual projects, service tags, and links to case studies.
4. **Services:** clear capability groups with distinctive visuals and direct links to details.
5. **Agency approach:** short explanation of how design and development work together; a restrained mascot moment.
6. **Process:** Discovery, Design, Build, Launch. Keep durations as placeholders until confirmed.
7. **Testimonials/results:** approved quotes and verified outcomes; omit unsupported content.
8. **Tools & Resources:** a small selection with Free/Paid badges and outbound links.
9. **Latest insights:** a few articles or updates linking to Blog.
10. **FAQs:** useful answers before conversion.
11. **Closing contact/booking section:** clear next step, booking area, email and WhatsApp alternatives.
12. **Footer:** navigation, contact, social, and policy links.

This is a proposed full homepage inventory. The first visual draft can shorten or combine agency approach/process and proof/testimonials to keep the page focused. Awards, partner logos, podcasts, careers, and extra enterprise sections from references are not automatically part of High4Tech's scope.

## Page contents

### Services directory

Intro and service groups with brief benefit-led descriptions, links to service details, process summary, relevant projects, and final booking/contact CTA. Candidate capabilities grounded in current positioning include UI/UX and web design, website development, app design/development, and custom software. SEO and marketing remain proposed from the initial blueprint; confirm the actual offering before final copy.

### Service detail template

Service-specific hero; target problem and audience; what is included; example deliverables; process; related case studies; relevant testimonials if approved; FAQs; booking/contact. Pricing is optional and appears only when real packages are supplied. Use inquiry CTAs for custom work.

### Projects directory and case studies

The directory uses large images, a short summary, service tags, and category filters. Case study: title and summary, client/context where approved, challenge, approach, solution, image/video gallery, verified results, related services, and next project/contact CTA. Use the Stōkt Heron reference for a large visual opening, clear project metadata, spacious editorial story sections, and varied gallery scale, adapted to white surfaces with black text and orange accents. Current project names such as The Shipping Kite and Driver Finder are candidates from the existing site; confirm real project details and intended final slugs.

### Tools & Resources

Intro, keyword search, All/Free/Paid filters, category selection, resource cards, and an empty-results state with Reset Filters. Each card has name, image/icon, description, category, Free/Paid label, and a source link.

Use **Use Tool** for free online tools, **Visit Platform** for paid offerings, and **View Resource** for articles or guides. Display an external-link indication. Only show exact prices when provided and maintained; otherwise state that pricing is on the destination platform. No local checkout, account system, subscription management, or payment-success page. No email gate by default; it is a separate optional decision.

### Blog and article template

Index: featured article, category filters, readable cards, dates, and a social-post subsection. Social embeds should load on demand or have linked previews so they do not dominate page performance. Article: title, author/date where supplied, cover, readable body, optional table of contents for long posts, share controls, related articles, and service/contact CTA.

### About

Agency story, positioning, principles, people or founder information only when supplied, both mascots used with intent, process/capabilities links, verified proof, and contact CTA.

### Contact

Intro, name, email, service interest, project brief, optional budget range, validation/error states, a policy link, booking area, and email/WhatsApp/social alternatives. Do not invent a phone number, street address, availability, or response-time promise. Real destinations must be confirmed before integration.

## User journeys

- Home -> selected project -> case study -> relevant service -> discovery call.
- Services -> service detail -> deliverables/FAQ -> inquiry or booking.
- Tools & Resources -> filters -> external platform -> platform handles use or purchase.
- Blog -> article -> related service or resource -> contact.
- Chat launcher -> question/demo answer -> service page or human contact.

## Items to confirm during the next discussion

Exact service list; preferred homepage emphasis; final hero message; verified projects, metrics, and testimonials; which supplied logo should lead the header; initial tools with categories and URLs; final contact and booking destinations. These do not block preserving references. This file records proposals without treating them as already approved.

## First draft boundary

After the structure discussion, build a responsive frontend with local sample content, public page templates, navigation, filters, 3D/GSAP treatments, and preview interaction states. Backend, CMS, database, real AI calls, email delivery, and payment flows stay outside this phase. No implementation was initialized while creating this reference pack.

## Current implementation update — 2 October 2026

The standalone landing has been replaced by the studio. `/` opens a Home window containing the agency introduction, expertise, black studio bento, selected projects, process, tools, journal, FAQs and contact. Existing routes open as windows within the same persistent shell. `/desktop` shows the workspace; a fresh load opens Home by default. The tour, theme, ambient music controls, desktop mascots and dock form the global visitor experience. Spotify/Apple Music shared-link playback is supported by embeds; personal account authorization remains future integration work.

## Current additions — 3 October 2026

Studio is the entry point. App Store holds external tools/resources; Gallery holds project images; Safari previews the former landing page; Toolkit is an installed-app grid. Newsroom replaces Journal, with legacy blog URLs retained. AI Zone, sample Pricing, and Play are additional studio apps. Sidebar navigation changes the current window; the dock can open other windows. See [studio-assets-and-behavior.md](studio-assets-and-behavior.md) for full behavior and source records.
