# Frontend library and effect references

Reviewed: 2 October 2026. These repositories were explored through their public documentation. No packages were installed and no repositories were cloned. The user has approved Three.js and GSAP; the other libraries below are candidates within that direction.

## React Three Fiber

Repository: [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber).

Purpose: React renderer for Three.js, allowing reusable scene components and interactions. Proposed use: the signature hero object and limited decorative 3D moments. The repository lists an MIT license. Its documented major-version pairing is Fiber 8 with React 18 and Fiber 9 with React 19; confirm current compatibility when scaffolding.

Keep page text, navigation, and forms outside the canvas. Use a static fallback and avoid loading a scene on every route merely for consistency.

## ShaderGradient

Repository: [ruucm/shadergradient](https://github.com/ruucm/shadergradient).

Purpose: configurable moving gradients for React. Current README describes a lean v2 renderer and separate UI pieces. Proposed use: a contained orange/white atmospheric accent that preserves the predominantly white interface. It overlaps with Three.js rendering, so evaluate whether a small custom scene is sufficient. Confirm package license, dependency compatibility, and render cost before adopting it. No dependency version is pinned in this planning pack.

## Liquid Logo

Repository: [collidingScopes/liquid-logo](https://github.com/collidingScopes/liquid-logo).

Purpose: WebGL/GLSL logo effects with a liquid-metal appearance. It is a browser-based tool, not a ready-made React component library. Proposed use: explore a short decorative logo treatment in the hero or closing section; integration would require adaptation or a derived asset. The README lists MIT licensing. Preserve a crisp original logo in navigation and a static alternative. Do not upload or process user assets through its demo during this planning stage.

## GSAP and ScrollTrigger

Official documentation: [GSAP](https://gsap.com/docs/v3/) and [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

The user requested GSAP. Proposed responsibilities: intro timing, restrained section reveals, process step highlighting, and optional synchronization with a Three.js scene. Read the current official documentation and license terms during implementation. Keep normal scrolling, keyboard access, and reduced-motion alternatives.

## Open desktop references

[react-ui-os](https://github.com/saschb2b/react-ui-os) is a free React OS component library with a macOS theme, window layer, Dock, Spotlight, and Finder-style surfaces. [MacOS-Web-Simulator](https://github.com/LikhithSP/MacOS-Web-Simulator) is a free interactive simulator with boot, draggable windows, Finder, Dock magnification, and app indicators.

For High4Tech, the current draft keeps a small custom desktop layer so project folders, the assistant, tools, Mail, and route behavior stay directly connected to the site. These references informed the interaction model and remain candidates for a later component extraction if the OS grows beyond the current scope.

## Library selection rule

Use a library because it supports an approved visual interaction, not because it appears in the reference list. Additional libraries are permitted by the user, but should add clear value. Keep the initial draft small enough to evaluate visual quality and mobile performance before adding more effects.
