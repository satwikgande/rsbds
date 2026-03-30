R&S Business Design & Solutions — Static Site

Overview

- Single-page static website built with HTML, CSS, and vanilla JavaScript.
- Premium consultancy styling and interactions (no frameworks).

Features

- Strong hero with background image and clean headline (add `hero.jpg`).
- Static, motion-free layout by default (animations removed for a calmer experience).
- Back-to-top button and scroll progress indicator.
- Image-led service cards and a small projects gallery.
- Responsive, accessible navigation with mobile toggle and keyboard support.
- Contact form with minimal client-side validation (simulated send).

How to customize

- Replace images (`hero.jpg`, `about.jpg`, `logo.jpg`, `images/service-*.jpg`, `images/project-*.jpg`, `images/client-*.png`) with high-resolution, optimized assets (suggested sizes: hero 2400x900, service cards 1200x800, project images 1200x800, client logos 300x80 PNG/SVG).
- Edit brand colors and type in `style.css` variables under `:root`.
- Fonts from Google Fonts are in the `<head>` of `index.html`.

Image filename suggestions:

- `hero.jpg` — large landscape hero image showing a professional team or city skyline
- `images/hero-overlay.png` (optional) — subtle transparent watermark or pattern to sit above the hero image (use a PNG or SVG with transparency; recommended opacity ~10-15%)
- `about.jpg` — team or office image
- `images/service-business-strategy.jpg`, `images/service-design-innovation.jpg`, `images/service-transformation.jpg`
- `images/project-1.jpg`, `images/project-2.jpg`, `images/project-3.jpg`
- `images/client-1.png`, `images/client-2.png`, `images/client-3.png`, `images/client-4.png`

Accessibility notes

- Respect `prefers-reduced-motion` — animations are reduced/disabled automatically.
- Keyboard-accessible cards (Enter/Space activate the primary card link).
- Focus styles for interactive elements and Skip link included.

Dev notes

- JS is in `script.js`. It's small and dependency-free.
- For production, consider minifying `style.css` and `script.js` and adding image optimization.

Contact

- If you want additional features (CMS integration, contact submission endpoint, analytics), I can add those next.
