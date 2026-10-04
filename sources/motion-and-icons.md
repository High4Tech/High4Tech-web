# Motion and icon system

Updated 4 October 2026.

## Motion foundation

[Lenis](https://github.com/darkroomengineering/lenis) drives the studio's content windows and Safari's landing preview. The [Satus starter](https://github.com/darkroomengineering/satus) is an architectural reference: its shared-clock approach is adapted to the existing Next.js/Payload app, rather than replacing the app with that template. Existing High4Tech desktop, typography, and Stōkt-inspired layouts remain the visual foundation.

Each active content window owns its scroll wrapper and content element. Lenis and GSAP ScrollTrigger share GSAP's clock; anchor navigation targets the owning window. Resizing refreshes scroll limits and reveal positions. Inactive/minimized windows detach their motion setup, and document visibility pauses the scrolling clock. Safari's iframe initializes a separate document-scrolling instance.

Wheel smoothing uses a restrained `0.105` interpolation value. Touch, browser zoom, horizontal controls, forms, chat history, Mail, and booking retain native behavior. The enhancement respects reduced-motion preferences; native scrolling remains a fallback. Do not add smooth scrolling to the CMS dashboard or interfere with chat scroll recovery.

Content reveals use a 24px rise over 650ms with `power3.out`; cards and small glyphs have restrained hover motion. Shared transition tokens are 180ms and 320ms. Safari retains its GSAP project sequence, section reveals, and bento microanimations. Reduced motion removes decorative movement.

Implementation: `components/page-scroll.tsx`, `app/motion.css`, and the existing landing/AI components. Keep content rails within the inner window, independently of the desktop sidebar.

## Iconography

[Phosphor React](https://github.com/phosphor-icons/react) is the implemented glyph library. Use duotone for semantic app/service artwork, regular weight for controls, and stronger small glyphs for traffic-light actions. `components/icons.tsx` maps established component names to directly imported SVG icons. Icon shape and weight are centralized; avoid mixing arbitrary icon families within one interface.

Preserve original High4Tech mascots, supplied Mac app artwork, and official company/social/technology logos. A generic glyph is not a replacement for WhatsApp or another company's mark. Icons are local SVGs, without a remote font or image request. Lenis and Phosphor are MIT-licensed.

## User-supplied alternatives

These are research options, not additional installed libraries. Check each chosen asset's license if using an alternative; not every asset/service listed is unrestricted or free.

- [Phosphor](https://phosphoricons.com/)
- [Remix Icon](https://remixicon.com/)
- [Tabler Icons](https://tabler.io/icons)
- [Iconoir](https://iconoir.com/)
- [Boxicons](https://boxicons.com/)
- [Hugeicons](https://hugeicons.com/)
- [Font Awesome](https://fontawesome.com/)
- [Flaticon](https://flaticon.com/)
- [Heroicons](https://heroicons.com/)
- [Lucide](https://lucide.dev/)
- [Google Material Symbols](https://fonts.google.com/icons)
- [The Noun Project](https://thenounproject.com/)
- [Icons8](https://icons8.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
