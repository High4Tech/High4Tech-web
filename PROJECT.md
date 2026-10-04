# High4Tech Web App

Project context consolidated on 4 October 2026 from the development conversation and current code. This is a durable handoff, not a verbatim transcript.

## Start here

- [Current brief and confirmed decisions](sources/project-brief.md)
- [Resources and attachment inventory](sources/project-resources.md)
- [Run and CMS instructions](README.md)
- [Live support and visitor profiles](sources/live-support.md)
- [Security protections and limits](sources/security.md)
- [Deployment configuration](sources/vercel-deployment.md)

The complete application remains in this folder. Brand originals, references and working notes are in `sources/`; runtime assets are in `public/`. Available original videos are preserved in the local, Git-ignored `project-archive/`. No code folder was moved or duplicated.

## Project identity

| Item | Value |
| --- | --- |
| Name | High4Tech Web App / High4Tech Studio |
| ChatGPT project | https://chatgpt.com/g/g-p-6ac21550c7e88191b885c31f30107839/project |
| Repository | https://github.com/High4Tech/High4Tech-web |
| Working folder | `C:/Users/nas/Documents/Codex/2026-10-02/yo` |
| Git metadata on this computer | `C:/Users/nas/Documents/Codex/h4t-git` |
| Development conversation | `01a0fb7a-f97f-7c30-bdcc-d1315c4c8dfb` |
| Original conversation title | Review agency website blueprint |
| Public preview | http://127.0.0.1:3000/desktop |
| CMS preview | http://127.0.0.1:3000/admin |
| Support inbox | http://127.0.0.1:3000/admin/conversations |

The original conversation remains in the desktop app. These files preserve its confirmed requirements, implementation context and reference links. A ChatGPT project receives uploaded sources; it does not automatically access this local folder or import the original Codex transcript. See [official project documentation](https://learn.chatgpt.com/docs/projects).

## Continue development

Read this file and `sources/project-brief.md` before making changes. Use the existing folder and Git remote. Follow `AGENTS.md`, including the installed Next.js guide requirement before coding. Prefer the current brief and latest user decisions over historical planning notes. Update the brief as decisions change.

Standing user instruction: after completing and verifying changes, commit and push them to the established `High4Tech/High4Tech-web` GitHub repository. Do not leave completed work only locally or ask for renewed push authorization. Report any actual push failure. Preserve private files and never force-push without explicit authorization.

Current stack: Next.js, React, TypeScript, Three.js, GSAP, Lenis, Phosphor icons and Payload with SQLite/libSQL. PostgreSQL was discussed earlier but is not the implemented database. A hosted shared database, production media storage and delivery providers still require configuration.

Frontend updates on 4 October add genuine bold supplied headings, bounded responsive content, a centered AI globe hero and shared Lenis/Phosphor motion/icon system. The latest Safari and AI Zone campaigns adapt the MIT Agency-AI template with original brand artwork, existing project media and the supplied motion film. The inner apps now have image-led editorial Newsroom, project library, visual service bento, Studio directory and selectable Pricing layouts; the desktop adds draggable newsroom cards and a timed assistant-to-pricing invitation. See [campaign template notes](sources/templates/README.md) and [motion and icons](sources/motion-and-icons.md).

Latest code milestone before this context pack: `008af87`, following security hardening `59dfc6a` and visitor profiles/inbox delivery `37b554d`. Previous implementation verification passed the production build, type checks, security, CMS, assistant, resources, chat and deployment checks. This context task changes no application behavior.

## Private files

`.env`, database files, `media/`, build output, dependencies, test fixtures and the original-video archive are excluded from Git and the portable source bundle. Never upload credentials, visitor profiles or private transcripts as project sources. Repository checkout alone does not restore the local CMS database.

Newsroom now has independent card/banner images and optional inline images in Payload, plus a Recent blog highlight on Home. Contact CTAs open the form directly; Mail remains separate. Calendar, Tools & Resources and floating assistant controls have been rebuilt. Paid checkout is an explicitly no-charge preview and saves no order or customer details. `npm run editorial:verify` checks the complete migration chain and image/publication behavior using a fresh disposable database under ignored `outputs/`.
