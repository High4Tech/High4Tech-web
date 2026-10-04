# Platform security

Implemented 4 October 2026. This records the current protections and their limits, not a penetration-test certification.

## Administration and private data

All CMS accounts are trusted administrators. Anonymous visitors cannot create accounts, read user records, drafts, raw knowledge documents, private messages or request counters. The first administrator is created only through `npm run cms:admin` in a private interactive terminal. Its password prompt is hidden; credentials never go into command arguments. Later accounts are created by signed-in administrators. New/changed passwords require 12–128 characters. Five failed account logins lock the account for 15 minutes, sessions last two hours, and REST login/refresh responses omit bearer tokens. Existing accounts and conversations are preserved.

Chat access uses a random HttpOnly browser cookie; only its SHA-256 hash is stored. Email or phone matching never grants another browser access to history. Private endpoints are not publicly cacheable, history pagination is bounded, and conditional requests are evaluated only after authentication/ownership checks. Browser response caches are cleared after an authorization failure. Visitor profiles/history remain cached locally as requested; people using a shared device should clear site data afterward. No cookie secret is stored in localStorage.

There is no outbound email provider yet. Password-reset email requests return a consistent unavailable response, and Payload's console email adapter has been replaced so it cannot log reset links or message content. Configure a real delivery adapter before enabling password reset. Mail project briefs still reach the private support inbox, and email-app links continue to work.

## Request protections

Chat, inquiries, assistant and CMS writes require a matching scheme, hostname and port in Origin. Missing/foreign origins and cross-site browser requests are refused. Configure the exact `SITE_URL` on deployment to pin the canonical origin; this also enables Secure session/visitor cookies on HTTPS even when the upstream request uses HTTP. Without it, the direct HTTP Host is used to support Next's normalized localhost URL. No forwarded host/protocol value supplied by a visitor is trusted.

Assistant, chat writes/profile creation, inquiries and authentication have atomic counters shared in the CMS database. SQLite/libSQL immediate transactions serialize checks and increments across instances. Global limits prevent attackers bypassing every limit by inventing cookies; per-visitor limits reduce spam. Counter identities are hashed, contain no raw contact details/IPs, and stale counters are removed hourly after 24 hours. If a trusted hosting proxy overwrites an IP header, set `TRUSTED_CLIENT_IP_HEADER` to that header. Leave it unset for direct hosting; unauthenticated callers without a visitor cookie share a conservative anonymous bucket. Preview mode without a database and high-frequency read caps use bounded per-process memory; deployment-wide traffic protection still belongs at the hosting proxy/WAF. Limits return 429 and Retry-After.

CMS JSON requests are limited to 512 KB, multipart requests to 4 MB plus 256 KB overhead, one file per request, and bounded field counts/sizes. Public REST page sizes are capped at 100, oversized query strings rejected, relationship depth limited to three, and unused GraphQL disabled. Next Server Actions retain the framework's body-size/origin protections.

## Media and links

Uploads authenticate before processing files and accept raster PNG/JPEG/WebP/AVIF/GIF only, up to 4 MB and 24 million total pixels. Sharp checks decoded format against MIME, then re-encodes to WebP, sanitizes filenames and strips metadata/extra payloads before storage. Animated imports become a static image. New SVG/HTML uploads and mislabeled files are refused. Media-file responses also use a sandbox policy to disable scripts in legacy files. Existing trusted brand SVG assets are unchanged. Remote URL uploads and direct-to-Blob uploads are disabled, so every new file passes server validation. Inspect any files uploaded before this hardening separately; they are not retroactively rewritten.

External CMS links must be HTTP(S), have no credentials/control characters, and local image/assistant paths cannot use protocol-relative URLs or backslashes. YouTube embeds use the existing allowlisted privacy-enhanced player. HTTPS media/third-party embeds remain available under the browser policy.

## Browser protections

Dynamic pages use fresh unpredictable script nonces with a Content Security Policy. Production scripts do not allow unsafe-inline or unsafe-eval. Inline styles remain allowed for React/GSAP/Payload. Frames are restricted to the site's own Safari preview, YouTube, Spotify, Apple Music and Cal.com; objects are blocked. Same-origin framing, nosniff, referrer policy, camera/microphone/location restrictions and HTTPS HSTS headers apply. Pages with nonces are private/no-store; static assets retain normal caching. Administrative API responses are private/no-store. Stored assistant JSON uses a local read-only field instead of fetching a code editor from an external CDN.

## Dependencies and checks

Patched DOMPurify to 3.4.16 and the old esbuild dependency to 0.28.2. The production audit went from 13 findings to six high findings, all tracing to the same unpatched `braces` advisory through Payload's cloud-storage dependency. No patched release is available in the advisory. These uses locate installed modules using application-defined glob patterns; visitor input must never become a glob pattern. The advisory remains visible rather than suppressed: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm

Run `npm run security:verify` against a warmed local server (with `NODE_ENV=production` for the CLI after development schema sync). It creates and cleans up temporary fixtures. Also run the existing CMS, chat, knowledge, network and deployment regression checks. Never expose the development server publicly. On deployment use HTTPS, private environment variables, a shared database, backups and provider-level traffic controls. These application protections do not provision those hosting services.
