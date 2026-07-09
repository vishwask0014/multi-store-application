# UI Generation Prompt — Multi-Store Marketplace

Use this as a build prompt for v0, Cursor, Claude Code, or any Next.js + Tailwind UI generator.

---

## Project context

A Next.js + TypeScript multi-tenant marketplace. Multiple independent stores live under one domain. Each store sells **items** (products) and/or **services** (bookable). A store is tagged:
- **Fulfilled** — sells both items and services
- **Filled** — sells only items, or only services

The tag should appear as a small badge on store headers and store cards.

## Visual direction

- Minimal, calm, dark UI. Nothing should shout — muted tones, generous whitespace, soft borders instead of heavy shadows.
- Reference inspiration: image-forward product cards, a left "Filter by" rail with category/size/price/color dropdowns, star ratings + price on cards, sticky category chip bar, big editorial hero banner up top. Keep that structure but restyle it into the dark palette below.
- Icon library: **Hugeicons** (`@hugeicons/react`, outline style). No emoji, no mixed icon sets.
- Typography: one sans-serif family, two weights only (400 regular, 500 medium). Large, confident hero type; restrained body text.

## Color system (CSS variables)

Derived from your 4 reference colors — I added tonal steps since a dark UI needs surface layering, not just 4 flat colors:

```css
:root {
  /* Backgrounds — darker steps derived from your navy for layering */
  --color-bg-base: #0F1620;       /* page background */
  --color-bg-surface: #1B2634;    /* cards, panels */
  --color-bg-surface-raised: #27374D; /* your navy — elevated surfaces, hover states */

  /* Borders */
  --color-border: #27374D;        /* your spec: border color */
  --color-border-strong: #34496b; /* lighter step, for hover/focus */

  /* Text */
  --color-text-primary: #DDE6ED;  /* your spec: headings, primary text */
  --color-text-secondary: #A9B7C4; /* muted step of the same tone, for subtext */
  --color-text-muted: #6E7C8C;    /* placeholders, disabled */

  /* Brand / accent */
  --color-primary: #5C8374;       /* your sage — primary buttons, active nav, links */
  --color-primary-hover: #6f9a89;
  --color-accent: #F5E8C7;        /* your cream — price highlights, badges, CTAs on dark */
  --color-accent-text: #27374D;   /* dark text used ON the cream accent for contrast */

  /* Semantic (kept muted, not saturated) */
  --color-success: #7BA88C;
  --color-warning: #D9B26B;
  --color-danger: #C77B6E;
}
```

Usage rules:
- `--color-primary` (sage) = buttons, active states, selected filters, cart icon badge.
- `--color-accent` (cream) = price text, "Fulfilled" tag, sparingly used highlights — never large fills.
- Borders are always `--color-border`, 1px, never shadows for card separation.
- "Filled" tag uses `--color-text-secondary` on `--color-bg-surface`; "Fulfilled" tag uses `--color-accent-text` on `--color-accent`.

## Layout & responsive navigation

- **Mobile & tablet**: fixed bottom navigation bar — Home, Categories, Cart, Bookings, Profile (5 icons max, Hugeicons outline, active state in `--color-primary`).
- **Desktop**: fixed left sidebar — logo top, nav icons + labels stacked, store switcher (for owners) near the bottom.
- Breakpoints: mobile `<640px`, tablet `640–1024px` (still bottom nav), desktop `>1024px` (sidebar).
- Content area shifts: `padding-left` for sidebar on desktop, `padding-bottom` for bottom nav on mobile/tablet.

## Core components to generate

1. **Top filter/category bar** — horizontal scrollable chips (All, Items, Services, plus store categories), sticky on scroll.
2. **Filter rail** (desktop: left column; mobile: bottom sheet) — Category, Type (Item/Service), Price range, Availability.
3. **Product/Service card** — image, title, rating stars, price, small type icon (bag = item, calendar = service) using Hugeicons, hover reveals a quick-view icon button.
4. **Store card** — store name, tag badge (Filled/Fulfilled), offering count, thumbnail grid preview of top 3 offerings.
5. **Cart drawer** — two sections: "Items" (with quantity steppers) and "Bookings" (with date/time shown instead of quantity).
6. **Hero banner** — large editorial type block + soft image, single CTA button in `--color-primary`.

## Deliverable format

Generate as Next.js (App Router) + TypeScript + Tailwind, reading all colors from CSS variables (not hardcoded hex in components), Hugeicons for every icon, fully responsive per the breakpoints above.