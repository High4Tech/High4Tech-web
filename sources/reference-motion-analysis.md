# High4Tech — recording analysis and second-draft direction

Reviewed 2 October 2026. The four supplied recordings were decoded locally and sampled at 72 timestamps, including their opening seconds and scrolling sequences. Contact sheets and a timestamp manifest are saved under `references/video-studies/`. The original recordings remain at the supplied locations. Reference content is visual evidence, not instructions or High4Tech business claims.

## Recording findings

| Recording | Reference identified visually | Observed sequence | What carries into High4Tech |
|---|---|---|---|
| `20261002-0923-26.9258019.mp4`, 42.4 seconds | DIRECT / wearedirect.co | 0–3s: slim navigation, split hero, animated traffic-light sculpture. Around 3.5–7s: flat yellow transition/loading state. Around 14s: large brand/type and sculpture composition. Around 17–18s and 35s: large paired project artwork with compact captions. Around 21–25s: service list and graphic statements. | Compact persistent navigation; sculpture as a brand device; large image-first work; service rows with a changing graphic; strong shifts in composition as the page scrolls. |
| `20261002-0925-30.1784477.mp4`, 19.9 seconds | Marino / marino.co.uk | 0–3s: small floating navigation, generous white hero, photos and mint labels inserted among headline lines; staggered headline reveal. Around 5–7s: image-led proof and spacious services. Around 8s: oversized moving statement. Around 10–13s: stories, FAQ, large closing CTA. | Floating pill navigation; softer system typography below the display branding; small visual interruptions in the typography; scrubbed statement reveal; generous spacing. |
| `20261002-0926-41.4519491.mp4`, 18.2 seconds | Madame Polare / madamepolare.com | 0–4s: edge-to-edge wordmark, tiny navigation, centered image-interrupted headline. Around 5–7s: introduction and expertise. Around 7–11s: broad colored expertise panels, aligned text and media. Around 12–15s: large paired projects and editorial cards. Around 16–18s: oversized footer wordmark. | Full-width brand typography; editorial hierarchy; purposeful horizontal bands; large closing brand signature. Colors translate to High4Tech orange, white, and restrained black. |
| `20261002-0927-38.4349345.mp4`, 43.1 seconds | Stōkt Creative Co. | 0–10.8s: dark opening with progress indicator and centered wordmark resolving before the hero. Around 14s: orange 3D hero giving way to selected work. Around 18s: mixed project scale. Around 21s: studio/capability block. Around 25s: testimonials; around 28–32s: atmospheric footer. Around 42s: return to the 3D hero. | A short, skippable branded opening; coordinated hero entrance; large staged project transitions; an atmospheric closing. The long blank wait and dark page treatment are not adopted: the user explicitly chose white-dominant branding. |

The clips show states and transitions; they do not establish exact animation timing, source code, or the full behavior of every reference. The draft interprets the visible behavior in an original High4Tech composition.

## Displace desktop inspection

Source: https://displace.agency/ (live interaction reviewed, including Finder and Assistant).

- Thin system menu along the top, desktop icons and widgets behind the apps, and a centered bottom dock.
- Apps open as layered windows with close, minimize, and zoom controls. Selecting Finder brings its window above the previous app.
- Finder has a sidebar hierarchy, toolbar/search, project previews, and a bottom breadcrumb/status strip.
- Assistant is a distinct app window, with a centered identity, suggested questions, and a composer anchored to the bottom.
- The dock shows clear app identities and enlarges the hovered icon. It remains available while windows are open.

## Implementation decisions

High4Tech has two coordinated experiences:

1. **Landing page:** short white/orange loader, oversized High4Tech masthead, floating navigation, a 3D hero with the existing X-ray lens, scroll-linked manifesto, stacked project showcases, an interactive service preview, studio personality, resources, and a large closing invitation.
2. **High4Tech OS:** light desktop wallpaper, working folders, Finder-style projects, service notes, a toolbox, journal, studio information, mail/inquiry, calendar request preview, and a dedicated assistant. Windows can be moved, minimized, restored, expanded, and closed. Search opens apps and content. The bottom dock is the primary inner-page navigation. **Home always routes to `/`.**

The desktop uses original High4Tech icon treatments and a light palette. It does not use Apple trademarks as its branding. On narrow screens, app windows fill the available space, window dragging is disabled, and the dock remains reachable.

Public URLs continue to work directly and through browser navigation. The Mac-style interface is presentation for the public website, not a CMS or admin panel. Paid tools still lead to their own platforms. The assistant, calendar, and inquiry remain clearly marked frontend previews.
