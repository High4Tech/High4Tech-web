# Deploying High4Tech Studio on Vercel

## Public preview

Importing the GitHub repository is enough to deploy the public studio using its bundled draft content. `vercel.json` selects `npm run build:vercel`. If the CMS environment is incomplete, the build skips database operations; the studio renders normally and `/admin` explains the missing settings. CMS writes are disabled until setup is complete.

This preview does not publish edits from your PC’s SQLite database. A Git push transfers code and seed content, not local database records or uploaded files.

## Enable the hosted CMS

1. Create a remote libSQL database, such as Turso. Copy its database URL and an authorization token into Vercel’s private environment settings.
2. In the Vercel project’s Storage section, create/connect a **public** Blob store. Connect its token to the Production environment.
3. In Project Settings → Environment Variables, configure the four values below for Production.
4. Redeploy the current commit. Check the build log for the migrations, initial-content check and successful Next.js build.
5. Open your deployed `/admin` and create your production admin account yourself.

| Variable | Value |
| --- | --- |
| `PAYLOAD_SECRET` | A private random secret of at least 32 characters. Keep it stable. |
| `DATABASE_URL` | Your remote `libsql://…` database URL; never `file:./studio.db` on Vercel. |
| `DATABASE_AUTH_TOKEN` | The remote database’s authorization token. |
| `BLOB_READ_WRITE_TOKEN` | The connected public Vercel Blob store token. |

Do not prefix these with `NEXT_PUBLIC_`, commit them to Git, or paste them into chat. Use separate database/storage credentials if enabling CMS editing in Preview deployments as well.

## What the build does

When all hosted-CMS settings are valid, `build:vercel` runs the committed database migrations, checks the initial content without overwriting existing edits, regenerates the admin import map and builds Next.js. A migration or connection failure stops the build. Remote databases do not use development schema auto-sync. Runtime cold starts do not seed the database.

Payload’s official Blob adapter stores uploaded images outside the function filesystem. Authenticated client uploads bypass Vercel’s server request upload-size limit. The CMS schema includes its media storage fields in both local and cloud environments.

## Local development

Continue using `npm run cms:setup` and `npm run dev`. Local development still uses `studio.db` and `media/`, preserves your existing admin account, and auto-syncs the additive schema changes. Do not run production migrations against that auto-synced database.

When moving your existing local edits to the remote database, use a deliberate content export/import and upload transfer. The initial hosted setup starts with the bundled approved draft. Your local account and local uploads are not automatically copied.

## Checks

`npm run deployment:verify` checks the deployment configuration guards. With a production server started using `VERCEL=1` and no cloud settings, set `DEPLOYMENT_TEST_ORIGIN` to its URL and run the same command to verify the public fallback, admin setup page and disabled CMS API. `npm run cms:verify` checks the configured local CMS publishing and uploads.

## Official references

- [Payload SQLite and remote libSQL configuration](https://payloadcms.com/docs/database/sqlite)
- [Payload Vercel Blob adapter](https://payloadcms.com/docs/upload/storage-adapters)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [Vercel Blob](https://vercel.com/docs/vercel-blob)
- [Turso](https://turso.tech/)
