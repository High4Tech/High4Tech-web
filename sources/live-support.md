# Platforms, video demos and live support

## Catalog setup

Resources now have a required, multi-select `platforms` field: WordPress, Shopify, Android, iOS, Custom, POS, and Other. Select only supported platforms; use `capabilities` for purposes and common synonyms (for example, inventory, stock tracking, low-stock alerts). Title, description, category and capabilities are searched together. A tool can support more than one platform. Free/Paid stays a separate filter.

The existing ShaderGradient, Liquid Logo and React Three Fiber entries are Custom tools. Other platform sections show an honest empty state until you publish tools for them. No invented Shopify or WordPress product links are seeded. Existing records and private draft versions are assigned Custom without republishing or discarding revisions.

The assistant handles platform lists, free/paid requests, purpose filtering and common single-edit spelling variations. It recommends only published entries with a real platform URL; a missing-link catalog preview is not recommended as an available tool. No match is reported clearly. It uses no paid model or outside knowledge. Queries remain conservative: add clear purpose terms/synonyms to the CMS rather than claiming capabilities a tool does not have.

Clicking a resource opens its own Studio detail page. The use/purchase CTA on that page opens the external seller/creator platform. Projects, Services and Resources each accept multiple optional YouTube videos (`title`, `url`). Supported URLs: HTTPS watch, youtu.be, shorts and embed. HTML and non-YouTube hosts are rejected. Visitors choose Play before a youtube-nocookie player is loaded; videos are not uploaded to the CMS image library.

## Conversations and takeover

Open **Live support inbox** in the admin navigation, or `/admin/conversations`. Before chatting, visitors supply a name, phone number and email. These are stored on their private conversation record and shown in the staff profile. Each browser session has individual message records. The contact fields do not create a verified account. These are self-reported details, not verified identities. No IP addresses or location are collected by the chat feature.

A random, HttpOnly, SameSite=Lax cookie identifies the browser conversation for one year, renewed on use. Only a SHA-256 hash of that token is stored in the database. HTTPS responses set Secure; local HTTP development still works. Contact details and up to 120 recent messages are cached on the visitor’s own browser for 30 days. The cached transcript is restored only after the server confirms the matching conversation cookie. Preview history is cached locally and explicitly labelled as unsaved to the inbox. Losing the cookie, clearing browser storage, or changing browser does not grant access to past chats just by entering the same email. Visitors never select a conversation ID, cannot access another session's transcript and cannot use direct Payload REST/GraphQL access to chat records. Server-authorized staff can read the inbox; chat mode, author role and ownership are writable only through its authenticated actions. Database write transactions serialize mode checks and message insertion; retries use unique request IDs to avoid duplicate visitor and staff replies. Message length is limited to 500 characters and visitor sends are spaced by at least 800 ms.

- **Assistant active:** published knowledge and catalog responses.
- **Wants a person:** requesting a human/employee or using the person button pauses automatic answers and flags the inbox.
- **Jump in / Take over:** claims the chat for the signed-in team member. New visitor messages wait for that person; the assistant stays paused.
- **Return to assistant:** clears ownership and resumes automatic replies.
- **Resolve:** closes the conversation. The visitor can start a new one; earlier history remains in the admin list.

Only the assigned staff member can reply or change a claimed chat. Another team member can mark its alert as read but cannot impersonate its owner. Records can be deleted by a signed-in administrator; deleting a conversation also deletes its messages. Messages are kept until deleted by the team; no automatic retention period is configured.

The inbox includes filters, visitor/message-preview search, pagination and older-message loading. Staff replies reach the visitor through polling (about 2 seconds after the previous request completes); inbox updates poll every 2.5 seconds and the selected staff transcript every 2 seconds. Hidden/offline tabs pause background polling and resume immediately on focus/visibility/online events. Polling never overlaps pending requests; timeouts and a manual inbox Refresh support recovery. Private conditional GETs transfer no transcript when unchanged; authentication/cookie ownership is checked before returning 304. Chat history is never put in public HTTP caches. This is browser-based live support, not a WebSocket or push service.

Human requests produce an in-app alert with View and Take over actions. Optional browser notifications require an explicit click on Enable browser alerts and a browser permission grant. They only work while the inbox is open. No notification email, SMS, or background push service is configured.

## Mail project inquiries

The Project brief form asks for name, email and phone, lets the visitor review, and offers **Send to studio inbox**. This saves the brief as a visitor message, marks the conversation as waiting/needs attention, and returns a receipt only after the transaction commits. Staff can take over and reply exactly as with chat. The optional Open email app action still opens Gmail/the visitor’s chosen mail client; external email is not imported into Payload. No Gmail synchronization or outbound email provider is configured. Inquiries have validated contact fields, a 2,500-character description limit, strict same-origin writes, unique retry IDs, and a 30-second repeat limit per conversation.

## Performance

Published website content is coalesced and cached server-side for up to 15 seconds, with immediate invalidation for CMS writes on the same server. Other instances refresh on expiry. The content endpoint uses conditional HTTP responses; the visitor keeps a bounded recent public snapshot for offline refresh. Assistant knowledge, private documents and tool recommendations still read current published records directly, so unpublishing/deleting knowledge is not delayed by this public cache. Bot replies no longer fetch every website collection.

## Hosting

Local development uses the existing Payload database. On Vercel, live chat/history and the admin inbox require the CMS environment described in [vercel-deployment.md](vercel-deployment.md). **Localhost and Vercel do not share a database automatically.** Connect the same hosted database (and Payload secret when using the same admin identities) in both server environments, or use the configured production dashboard at the same origin as the live website. Never expose the local SQLite database or embed its credentials in frontend code. The inbox reports local versus shared storage so this mismatch is visible. Importing the repository alone does not copy `studio.db` or provision a remote database. With incomplete CMS setup, public tools/assistant use bundled preview content; conversations are not saved and the human button explains that live support is not connected, with WhatsApp as an alternative. A configured database failure is reported rather than silently switching to preview content.

Migration `20261003_190618_chat_profiles_and_inquiries` adds phone/channel/inquiry timestamps and contact indexes. Migration `20261003_160640_platform_resources_live_chat` adds the schema and backfills current platforms. Transactions are enabled for the SQLite/libSQL adapter. Do not apply migrations to an already auto-synced development database; use the production migration workflow or a separate empty database.

## Design reference

[GO chatbot design on Figma](https://www.figma.com/design/dxZUj3AlKSm8II2xgIvFwY/GO-chatbot-design-_-GO?node-id=2953-15870) informed the conversation list / transcript / visitor details arrangement and jump-in controls. High4Tech orange replaces reference accents, with native light/dark admin colors and the studio's own mascot in visitor Messages. Visitor identities, contents, and statuses are real application data; sample identities, integrations and external assets from the reference are not shipped as claims or placeholder customers.

## Verification

`npm run resources:verify` tests platform lists, specific purposes, misspellings, prices, unknown purposes and safe YouTube URL parsing. `NODE_ENV=production npm run chat:verify:cms` tests private drafts/revisions, video field validation, durable/resumable history, cross-visitor isolation, private REST collections, authentication, cross-origin restrictions, duplicate sends, handoff notifications, staff takeover/replies, returning to bot, resolution and new sessions. `npm run chat:verify:network` exercises slow-request serialization, visibility recovery, cache invalidation and contact validation. The CMS integration suite also tests required profiles, second-browser inbox delivery, conditional private responses and direct inquiry delivery. It creates and removes only temporary fixtures and a temporary test admin. Existing admin accounts are untouched.
