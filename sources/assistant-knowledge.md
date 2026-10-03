# High4Tech studio assistant

## What it does

The assistant answers with exact text from the studio's **published** approved Q&A and knowledge documents. Each answer identifies its source. It declines a question when its meaningful terms do not have a supported match, including unrelated subjects and mixed questions with unsupported terms. It never calls a general-purpose language model, browses the web, executes file instructions, or sends your knowledge to an external AI provider.

This is a free retrieval assistant, not a trained or generative model. It recognizes greetings, thanks, goodbyes and questions about using the assistant without requiring a knowledge upload. These conversational replies do not claim a business source. Business questions support common phrasing, related terms and unambiguous one-character spelling errors (including adjacent letter swaps). Unsupported or ambiguous questions still decline rather than invent an answer. Add an approved Q&A with useful keywords for important visitor questions. There are no per-message model charges; normal website, database and storage provider limits/costs still apply.

## Admin workflow

1. Sign into `/admin`. The studio dashboard shows published sources and a test panel.
2. Choose **Import knowledge**. Select a UTF-8 TXT, Markdown, CSV or JSON file, or paste/write text directly.
3. Review the extracted text. Only publish public business information.
4. Save as a draft while preparing, then publish when ready.
5. Test a visitor question on the dashboard. This uses the same `/api/assistant` endpoint as the website and reads published content only.

**Approved answers** supports focused question/answer entries with keywords and optional local navigation links. Public email and WhatsApp details also come directly from **Contact info**, so visitors can ask how to reach the studio. **Assistant settings** controls enabled state, welcome message and fallback response.

Original files are not retained. The reviewed text, source filename and publication versions live in the CMS database. Document REST reads are admin-only. The anonymous assistant can return a matched passage from a published document; it never returns the full document as a download. Unpublished revisions preserve the last published answer. Deleting a source removes it from subsequent searches. Existing conversations may still display an answer received before a source changed; conversations are browser memory only.

## Import formats and limits

- One file at a time, at most 256 KB and 60,000 extracted characters. Split larger documents.
- TXT and Markdown preserve readable text; markup is displayed as text rather than executed.
- CSV requires headers and consistent columns. Quoted commas/newlines are supported. Each row becomes a passage labeled by its headers.
- JSON objects/arrays become labeled values, with nesting limited to 12 levels.
- PDF, DOCX, images/OCR and spreadsheet workbooks are not supported in this first version. Export readable UTF-8 text/CSV/JSON instead.
- Visitor questions are limited to 500 characters and request bodies to 4 KB.

## Deployment

Local development uses the existing Payload database. Production requires the remote database/CMS environment described in [vercel-deployment.md](vercel-deployment.md). The committed migration adds the document/version tables, settings and lock relations.

If the CMS has not been connected, the public assistant uses the bundled approved Q&A and labels replies as bundled studio knowledge. Uploaded local documents do not transfer through Git. If a configured database becomes unavailable, the assistant reports unavailable instead of falling back to stale preview answers. The UI supports timeout, retry, source labels, catalog result cards, saved conversations and live staff takeover. See [live-support.md](live-support.md) for platforms, videos, visitor privacy and the admin inbox. Starting a new conversation preserves earlier history for the team when CMS support is connected.

## Music account access decision

Account-library syncing is deferred as requested. Spotify requires a registered app, OAuth and approved access; new development apps currently allow five allowlisted users and require a Premium app owner. Public extended access has additional eligibility/review requirements. Apple Music library access requires MusicKit credentials and user authorization. Existing official playlist embeds remain available; no fake account-connection button is shown and ambient music plays only after a visitor chooses Play.

- [Spotify quota modes](https://developer.spotify.com/documentation/web-api/concepts/quota-modes)
- [Apple MusicKit](https://developer.apple.com/musickit/)

## Verification

`npm run assistant:verify` checks greetings, basic conversational questions, common phrasing, spelling tolerance, contact details, exact source replies, unrelated/mixed queries, injection attempts, empty knowledge and file parsing. `npm run assistant:verify:cms` creates a temporary document, verifies draft privacy, publication, private revisions, citations, deletion and request protection, then removes its fixture. It does not create users or edit existing knowledge.
