# High4Tech Studio

Custom Next.js / React / TypeScript website with a desktop-inspired interface, Three.js and GSAP. Payload manages published website content in the same application. Brand orange is `#F97328`; the studio supports light and dark themes.

## Run locally

Use Node.js 22 or newer.

```sh
npm install
npm run cms:setup
npm run dev
```

Open `http://127.0.0.1:3000` for the studio or `http://127.0.0.1:3000/admin` for Payload. On a new installation, run `npm run cms:admin` privately in your terminal to create the first administrator (hidden password prompt). Existing accounts continue to work. Public account registration is disabled; there is no default account.

`cms:setup` generates a local secret in `.env` only when that file does not already exist. Local development uses `studio.db` (SQLite) and `media/` for uploaded images. These files and credentials are excluded from Git. Existing draft content is seeded once into an empty CMS; later edits and deletions are preserved.

## Content management

- **Services:** descriptions, deliverables, detail routes and YouTube videos.
- **Projects:** case studies, cover images, gallery uploads and YouTube walkthroughs.
- **Newsroom:** articles, categories, images and publication dates.
- **Resources:** free/paid tools, platform categories (WordPress, Shopify, Android, iOS, Custom, POS, Other), searchable capabilities, YouTube demos and external platform links.
- **Pricing:** packages and the flag identifying illustrative prices.
- **AI services:** automation and AI offerings.
- **FAQs and Approved answers:** public Q&A, assistant source text and keywords.
- **Knowledge documents:** import TXT, Markdown, CSV or JSON and publish reviewed assistant knowledge.
- **Assistant settings:** enable/pause the assistant, welcome message and unsupported-question response.
- **Site settings:** agency name, logos, home introduction and about text.
- **Contact info:** email, social links, booking link and Mail’s welcome message.

Save a draft while editing; use Publish to make collection content public. Globals become live when saved. The studio refreshes published data when the tab regains focus and every 30 seconds while visible. Newly published service, project and Newsroom slugs have their own routes. Layout, visual effects and fixed interface labels remain in the code.

The assistant searches published studio knowledge, returns exact source passages with citations, and declines unsupported questions. It uses no paid AI API or external knowledge and saves conversations privately in the CMS when configured. Platform and purpose requests return matching published resource cards. The support inbox at `/admin/conversations` lists visitors, flags human requests, and lets a signed-in team member take over, reply, return control to the assistant, or resolve the chat. The admin dashboard includes source counts, import shortcuts and a visitor-answer test. See [the assistant guide](sources/assistant-knowledge.md) and [the live support guide](sources/live-support.md). Mail displays a configurable welcome message. Project briefs are delivered and stored privately in the support inbox when the CMS is connected; opening the visitor's email app is also available. Gmail messages are not automatically imported. Resources open the tool’s own platform for access or purchases. Music only plays when requested.

## Checks

```sh
npm run typecheck
npm run build
```

With the development server running, `npm run cms:verify` checks public publishing, private drafts and revisions, unauthenticated write restrictions, and upload delivery. It creates and removes only temporary content/media fixtures; it never creates an admin account. `CMS_TEST_ORIGIN` can override the default local URL.

`npm run assistant:verify` checks grounding and file imports. `npm run assistant:verify:cms` checks publication, private revisions, document privacy and deletion. Warm up the local server first. After schema changes, avoid running development schema auto-sync in two processes at once; use `NODE_ENV=production` for a verification CLI once the development server has synced its schema.

`npm run resources:verify` checks platform/purpose searches and safe video URLs. With the local server running and its schema synced, `NODE_ENV=production npm run chat:verify:cms` checks saved chat privacy, handoff, staff replies, duplicate sends, draft resources and videos. This creates and deletes only temporary test records and a temporary test admin; it leaves existing accounts untouched. On PowerShell set `$env:NODE_ENV="production"` before running the verification.

After schema changes, regenerate `payload-types.ts` and the admin import map using `npm run cms:types` and `npm run cms:importmap`. Generate a migration with `npx payload migrate:create descriptive_name`.

`npm run security:verify` checks origins, browser nonces/headers, account privacy, login lockouts, shared rate limits and upload validation against a running local server using temporary fixtures. See [the security notes](sources/security.md) for implemented protections, deployment settings and the remaining upstream dependency advisory.

## Production

**Vercel:** the repository includes `vercel.json` and a hosted build script. The public studio works with bundled content before CMS setup. To enable the hosted CMS, connect a remote libSQL database and public Vercel Blob store and set `PAYLOAD_SECRET`, `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, and `BLOB_READ_WRITE_TOKEN`. The hosted build runs migrations and a non-overwriting content bootstrap. Follow [the Vercel deployment guide](sources/vercel-deployment.md). Local database records and uploads do not travel through Git.

Use a persistent Node host with durable SQLite and image storage, or change the database/upload adapters for the selected host. Set a private `PAYLOAD_SECRET` and `DATABASE_URL` in the host’s environment. Keep the secret stable. A fresh production database needs `npm run cms:migrate` before build/start. The initial migration is included in `cms/migrations/`.

Do not apply the initial migration to the auto-synced development database. Use a separate fresh production database and plan a content export/import when deploying existing local edits. Back up the database and uploaded media together. Database files and uploads are not transferred by Git.

Configure a real Payload email adapter before relying on password-reset emails; the local development fallback logs email rather than delivering it. The public studio’s Reply action works through the visitor’s email app independently.

Production preview: `npm run build`, then `npm run start`. Preview metadata currently remains `noindex` until the site is ready to launch.

## References and assets

`sources/` preserves the approved visual direction, reference websites, repository links, originals and asset provenance. Brand assets are under `public/brand/`. Display font: locally packaged Unbounded (OFL-1.1); interface and form text use native Apple/system fonts. See `sources/payload-cms.md` for the CMS editing map.

Visitor chat now requires name, phone and email and remembers the browser profile/history. Mail project briefs can be sent directly to the live inbox. See [live support setup](sources/live-support.md) for private browser memory, caching, network recovery, and the shared hosted database needed for Vercel visitors.
