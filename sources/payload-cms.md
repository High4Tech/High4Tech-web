# Payload CMS and studio content

The frontend remains a custom React/Next.js studio. Payload 3.90.2 is integrated at `/admin`, with public REST endpoints under `/api`. SQLite keeps the local setup self-contained. Route groups separate CMS layouts and styles from the studio.

## Editing map

| Admin section | Website use |
| --- | --- |
| Services | Home settings rows, Expertise, service details, Safari preview |
| Projects | Finder, home projects, Gallery, case studies, client loop |
| Newsroom | Article feed, detail pages, live sidebar’s latest story |
| Resources | App Store/toolbox, free and paid filters |
| Pricing | Pricing page; illustrative-price labels |
| AI services | AI Zone cards and details |
| FAQs | Home clarity section and FAQ components |
| Approved answers | Published Q&A, conservative knowledge search, citations and navigation links |
| Knowledge documents | Imported TXT, Markdown, CSV or JSON; published source passages for the assistant |
| Assistant settings | Enable/pause, welcome message and unsupported-question response |
| Media | Uploads, project covers/galleries, Newsroom images, logos |
| Site settings | Agency/studio names, marks/logos, headline, introduction, about text |
| Contact info | Mail address/welcome message, social links and booking URL |

Use lowercase, hyphen-separated slugs. Sort order controls frontend ordering. Uploading a cover replaces the optional existing local image path. Add gallery rows for additional project photographs and supply alt text.

Collection records support drafts and published versions. An unfinished revision does not replace its public version. Visitors cannot write content, change settings, create users, or read drafts. The owner creates the first admin account through Payload’s initial setup page.

The server sends public content through `/api/studio-content`. The studio refreshes on tab focus and every 30 seconds while visible. Initial content is seeded once from `lib/studio-content.ts` / `lib/content.ts`; those files provide starting content rather than live editing.

Mail is a configurable welcome message with a mailto Reply action, rather than a connected inbox. The assistant retrieves exact passages from published studio knowledge, cites the source and declines unsupported questions. It uses no external AI API and saves private conversation history in the configured CMS. CMS password-reset emails require an email adapter. Paid tools use their external purchase platforms.

The custom `/admin` dashboard contains assistant counts, file/Q&A shortcuts and a visitor-answer test panel. See [assistant-knowledge.md](assistant-knowledge.md) for imports, limits and publication behavior.

## Development files

- `payload.config.ts`: database, secret, admin and bootstrap configuration.
- `cms/collections.ts`: schemas and access controls.
- `cms/seed.ts`: one-time starting content.
- `lib/cms-content.ts`: public data mapping.
- `components/content-provider.tsx`: frontend content refresh.
- `app/forms.css`: shared fields and responsive Mail layout.
- `components/studio-mail.tsx`: Inbox, welcome email and project brief.
- `cms/migrations/`: initial database schema.

Local `.env`, `studio.db` and `media/` stay outside Git. See the root README for setup, persistent hosting, migrations and backups.

Vercel uses remote libSQL and the official Blob adapter. Until all hosted settings are configured, the public studio displays bundled content and the admin explains setup. See [Vercel deployment](vercel-deployment.md).

## Official implementation references

- [Payload installation](https://payloadcms.com/docs/getting-started/installation)
- [SQLite adapter](https://payloadcms.com/docs/database/sqlite)
- [Access control](https://payloadcms.com/docs/access-control/overview)
- [Database migrations](https://payloadcms.com/docs/database/migrations)
- [Email adapters](https://payloadcms.com/docs/email/overview)

## Editorial images and tool previews

In **Newsroom**, set **Card image** for feed/Home cards and **Article banner image** for the inner page. The old **Legacy image** remains a fallback so existing articles keep working. With no uploaded media, original High4Tech editorial artwork appears. Set Published date to choose the recent-blog ordering; undated entries retain the existing sort order.

Add **Images within the article** rows to place images after a 1-based paragraph number. Each row supports an uploaded image (or safe local path), alt text and optional caption. Images with an insertion number beyond the article length appear at its end. Save a draft to review privately, then publish.

In **Resources**, add a **Tool preview image** or safe local image path, the existing YouTube demo links, platform/category/purpose information and Free/Paid status. **Demo checkout price (USD)** controls the illustrative amount only. The checkout form saves no customer/order and charges nothing. Use the resource URL for real external access or purchases.

The additive `20261004_171942_editorial_media_store` migration supplies these fields in production. Follow the existing deployment migration workflow; do not apply the chain to an auto-synced development database. `npm run editorial:verify` uses its own isolated fixture database/media folder and checks the full chain, independent card/banner media and private revisions without touching the existing database.

Local development note: Drizzle's schema push produced duplicate CREATE INDEX statements while normalizing the new SQLite media references. The existing local database was backed up and its pending schema normalization was tested on a private clone, then applied atomically with duplicate index statements removed. All tables/records, integrity and foreign keys were verified; the next schema inspection returned no pending changes. No backup or customer records are included in Git. Production uses the verified additive migration chain, not the development repair.
