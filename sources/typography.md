# High4Tech typography

Confirmed 4 October 2026. This supersedes earlier Unbounded, Georgia and system-font directions.

Display headings use **PP Neue Montreal**. Paragraphs, navigation, buttons, forms, conversation text and small interface headings use **Helvetica Neue**. The original wordmark remains an image; do not recreate it in either font.

The system follows the user's [Untitled High4Tech typography library](https://www.figma.com/design/NU1SlgUvw6zmalvW1Qhj6K/?node-id=18-1951), inspected at its Typography frame `1023:36826`. Its font families are replaced by High4Tech's supplied families; its type scale and tracking are retained.

| Role | Size / line height | Tracking | High4Tech family |
| --- | --- | --- | --- |
| Display 2xl | 72 / 90 px | −2% | PP Neue Montreal |
| Display xl | 60 / 72 px | −2% | PP Neue Montreal |
| Display lg | 48 / 60 px | −2% | PP Neue Montreal |
| Display md | 36 / 44 px | −2% | PP Neue Montreal |
| Display sm | 30 / 38 px | 0 | PP Neue Montreal |
| Display xs | 24 / 32 px | 0 | PP Neue Montreal |
| Text xl | 20 / 30 px | 0 | Helvetica Neue |
| Text lg | 18 / 28 px | 0 | Helvetica Neue |
| Text md | 16 / 24 px | 0 | Helvetica Neue |
| Text sm | 14 / 20 px | 0 | Helvetica Neue |
| Text xs | 12 / 18 px | 0 | Helvetica Neue |

Large headings interpolate between scale endpoints to fit resizable studio windows. Reading copy uses Text md; compact cards use Text sm. OS chrome retains compact sizes where fixed menu/dock geometry requires them. Small UI headings use Helvetica. Mobile form controls use at least 16px. Theme changes never switch the fonts.

Regular and medium use supplied 400 and 500 files; bold uses 700. The inspected library's semibold token resolves to 700, so semibold and bold both use the supplied bold face. Unsupported intermediate weights are replaced; synthetic weight/style rendering is disabled. Italic assets cover editorial emphasis.

## Assets and implementation

- Originals supplied in `pp-neue-montreal-cufonfonts.zip` and `helvetica-neue-5.zip` from the user's Downloads folder.
- Selected static faces are compressed to WOFF2 without glyph subsetting, stored in `public/fonts/`, and loaded on demand with `font-display: swap`.
- [Font manifest](font-manifest.json) records source names, source weights, compressed sizes and hashes.
- `app/typography.css` defines shared faces, scale tokens and role mappings. Both the frontend and Payload layouts import it after their component styles.
- Existing `--display`, `--body`, `--os-font` and Payload `--font-body` aliases resolve to the shared families. There are no Google Fonts requests or active Unbounded imports.
- Maintain this pairing in future screens; select a semantic scale token instead of introducing another font family.
