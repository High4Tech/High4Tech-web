# Studio updates — 3 October 2026

## User-facing behavior

- `/` opens the studio after a brief logo boot screen. Contextual first-use tips replace the opening tour. Tips can be skipped and reset from Help.
- Sidebar links replace the content in the same window. Dock and desktop shortcuts can open separate apps.
- Minimized windows appear in a side tray and remain available from the dock. Minimize, restore, and maximize use short wave-like transitions with reduced-motion support.
- App Store maps to `/tools-and-resources`; checkout and account handling stay on each tool's external platform.
- Gallery (`/gallery`) shows all project images currently present in the project data: The Shipping Kite and Driver Finder.
- Safari (`/safari`) contains the existing landing design at `/preview`. Internal links open matching studio content; in-page scroll links stay inside the preview.
- Toolkit (`/toolkit`) is a searchable installed-app grid. The top tools loop is restored and uses the same stack data and original logos: React, Next.js, Three.js, GSAP, TypeScript, and Figma.
- The client loop is centered above the dock within its navigation container, without the “In good company” label. The desktop welcome card and bottom folder/shortcut hint are removed.
- Newsroom (`/newsroom`) replaces the Journal label. Old `/blog` URLs remain supported. Visual reference: https://www.apple.com/newsroom/ — editorial hierarchy, generous typography, a prominent lead story, and rounded story cards.
- AI Zone (`/ai-zone`) explains workflow automation, assistants, integrations, and a four-step inquiry workflow concept. No live AI or automation backend is claimed.
- Pricing (`/pricing`) uses user-authorized dummy USD amounts: $1,490/project, $990/workflow, $790/month. These are visibly marked illustrative, not live offers. Replace before launch.
- A nonblocking pricing reminder appears once after one minute per tab session, unless Pricing was already visited. The dollar icon is always in the top bar.
- Play (`/play`) includes Studio Pairs, a local matching game with shuffled cards, move counts, and restart.
- Music never starts from an unrelated click. Play, a library track, or the external music player's own controls initiate music. Next while paused stays paused.
- Sound preference is independent of music playback and persists locally. Forms prepare drafts only; no mail is submitted by this frontend.

## Figma icon pack

User-provided file: https://www.figma.com/design/dIjWorlPr6LTOBUQBZlYVr/Free-Mac---iOS-Custom-icon-pack--made-in-Figma--V-1.8--Community-?node-id=0-1

Read through the Figma connector and implemented from design contexts and screenshots. Local asset exports:

| Icon | Node | Local asset |
| --- | --- | --- |
| Safari | 158:84 | `public/icons/figma/safari.svg` |
| Photos / Gallery | 79:306 | `public/icons/figma/photos.png` |
| Finder / Projects | 177:183 | `public/icons/figma/finder.svg` |
| Figma | 38:2 | `public/icons/figma/figma.svg` |

Safari, Finder, and Figma retain their supplied geometry and backgrounds through `MacIcon` CSS. Photos uses the full exported icon with its transparent padding positioned out of the icon bounds. The pack contains no App Store icon; that app uses a local matching blue icon. Remaining utility symbols are Lucide.

Brand marks are stored locally from https://github.com/simple-icons/simple-icons/tree/develop/icons (React, Next.js, Three.js, GSAP, TypeScript, WhatsApp, Instagram, Behance, Spotify, Apple Music). Keep brand shapes intact rather than substituting generic social or chat glyphs. Do not imply these companies endorse High4Tech.

`public/brand/mascots-cutout.svg` preserves the supplied mascot vector artwork and face whites while removing the canvas background subpath. The original file remains intact. Hover motion is CSS-based and disabled for reduced motion.

## User-supplied SFX

Files copied without transcoding from the user's Downloads directory. Local files are in `public/audio/ui/`.

| Local file | Original supplied filename | Action |
| --- | --- | --- |
| click.mp3 | u_o8xh7gwsrj-app_interface_click_2-476372.mp3 | Buttons, filters, links |
| open.mp3 | 47313572-ui-pop-sound-316482.mp3 | Open an app or folder |
| off.mp3 | 47313572-ui-sound-off-270300.mp3 | Close a window, mute sounds |
| minimize.mp3 | arnav_geddada-ui-sound-374228.mp3 | Minimize |
| maximize.mp3 | arnav_geddada-ui-sound-2-374229.mp3 | Maximize |
| accept.mp3 | liecio-menu_beep_accept_soft-533780.mp3 | Successful draft/copy, valid player link, matched cards, enable sounds |
| error.mp3 | soundshelfstudio-ui-error-pop-515668.mp3 | Invalid music link or failed copy |
| notification.mp3 | u_3ay6aijdt2-bell1-445873.mp3 | Assistant response |

SFX are user-triggered, respect the sound toggle, and stop the previous clip to avoid overlap. Source licensing details were not supplied with these attachments.
