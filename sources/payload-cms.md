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
| Chatbot data | Assistant answers matched by keywords; local navigation links |
| Media | Uploads, project covers/galleries, Newsroom images, logos |
| Site settings | Agency/studio names, marks/logos, headline, introduction, about text |
| Contact info | Mail address/welcome message, social links and booking URL |

Use lowercase, hyphen-separated slugs. Sort order controls frontend ordering. Uploading a cover replaces the optional existing local image path. Add gallery rows for additional project photographs and supply alt text.

Collection records support drafts and published versions. An unfinished revision does not replace its public version. Visitors cannot write content, change settings, create users, or read drafts. The owner creates the first admin account through Payload’s initial setup page.

The server sends public content through `/api/studio-content`. The studio refreshes on tab focus and every 30 seconds while visible. Initial content is seeded once from `lib/studio-content.ts` / `lib/content.ts`; those files provide starting content rather than live editing.

Mail is a configurable welcome message with a mailto Reply action, rather than a connected inbox. The assistant is a CMS-fed scripted guide. CMS password-reset emails require an email adapter. Paid tools use their external purchase platforms.

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
