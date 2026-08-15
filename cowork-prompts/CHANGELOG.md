# Changelog — Cowork Prompts for richardangelomclean.com

All notable changes to the project's Cowork handoff prompts are logged here. Each entry corresponds to a snapshot in `snapshots/`. Newest entries first.

Format: `## [version] — YYYY-MM-DD` followed by what changed and why.

---

## [1.3.0] — 2026-08-06

**SEO release.** Implements the technical SEO plan (see Notion: Context for Claude > SEO Plan). Motivation: site was indexed but had no relevance signals for "Richard McLean" (exact phrase) or "Seattle", both absent from the page. Most items were bookmarked in next-deploy-plan.md and never shipped.

### Changed
- Title tag: now "Richard McLean | Seattle Live Multi-Camera Production Director"
- Meta description: rewritten to include name, Seattle, Emmy, and role keywords
- Added canonical link tag (apex domain)
- Added JSON-LD Person schema in head (from schema-draft.md, completed: sameAs filled with 8 profiles including IMDb nm8883810 and Instagram; alternateName "Richard McLean" / "Richard A. McLean"; Seattle PostalAddress; em dashes replaced per copy rule)
- About bio: added one sentence "I'm based in Seattle and work with productions locally and worldwide."
- Footer: added "· Seattle, WA" after name

### Added
- sitemap.xml (single URL; fixes the 404 referenced by robots.txt)
- _redirects (301 www -> apex, forced)

### Deferred to Richard
- git push (Netlify deploy, 15 credits)
- Google Search Console setup + sitemap submission
- Adding site link to LinkedIn, UW Comm Lead profile, Relay Station about page, Substack, CreativeMornings
- Confirm old Wix site fully offline before September cancellation

---

## [1.0.0] — 2026-04-09

**Initial snapshot.** Captures the full project state after the first extended Cowork build session.

### What was built
- Single-page static portfolio site (HTML/CSS/vanilla JS, no build step)
- JSON-driven carousel with 17 project cards (image + video support)
- JSONP fallback for local file:// preview
- Two-tier title system (brand + optional subtitle)
- Multi-paragraph description rendering via `\n\n` delimiter
- Locked design system from Google Stitch handoff (colors, typography, layout)
- Vimeo reel embed, About section with credential callout, Contact with LinkedIn/Substack
- Accessibility: aria labels, keyboard nav, prefers-reduced-motion, focus rings

### Decisions made during session
- Hero headline font reduced to `clamp(2.25rem, 6vw, 4.25rem)` to prevent "multi-camera" line wrap
- Non-breaking hyphen (`&#8209;`) used in "multi-camera" to prevent mid-word breaks
- Carousel layout: single-column stacked (media on top) — two-column was attempted and reverted
- Role label uses `align-self: flex-start` to constrain amber underline width
- PBS moved to position 3 (after Pokémon) to break up same-industry clustering
- Crunchyroll description stripped to one line after Richard flagged filler writing
- GIFs converted to MP4 (CRF 23, H.264) to reduce total asset size from 300+ MB to ~24 MB

### Open items carried forward
- UW Building Community: should role line say "Graduate Course Creator & Instructor"? (recommended, not yet approved)
- Desktop carousel: description falls below the fold due to 16:9 media height (unresolved UX)
- README JSON examples still reference old `title` field instead of `brand`/`subtitle`
- `projects.js` must be regenerated after any `projects.json` edit
- Deployment not started (GitHub → Netlify → Namecheap DNS)
