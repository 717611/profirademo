## Fix: About page renders zoomed-out on mobile

### Root cause
Mobile browsers auto-scale a page down when its content is wider than the viewport. On `/about`, two elements push width past 390px:

- `HeroOrb` placed at `-top-4 -right-10` (160px) overflows the right edge of `.profira-container`.
- The hero heading uses `--text-hero: clamp(3.6rem, 12vw, 5.6rem)`. The 3.6rem (~57.6px) floor is too large for small screens and makes "About PROFIRA" overflow.

### Changes (scoped, visual-only)

1. **`src/routes/about.tsx`** — constrain the decorative orb so it can't cause horizontal overflow:
   - Wrap the hero section with `overflow-hidden` (keeps the orb visually clipped to the section instead of pushing page width).
   - Move the orb from `-right-10` to `right-0` / `-right-4` and ensure `pointer-events-none` (already there).

2. **`src/styles.css`** — lower the mobile floor of the hero type scale so it fits a 390px viewport:
   - Change `--text-hero: clamp(3.6rem, 12vw, 5.6rem);` → `clamp(2.6rem, 11vw, 5.6rem);`
   - This only affects the smallest screens; tablet/desktop sizes are unchanged because `12vw` / `5.6rem` still dominate above ~390px.

3. **Safety net** — add `overflow-x: hidden` to `.profira-container` in `src/styles.css` so any future decorative overflow doesn't re-trigger the auto-zoom behavior.

### Out of scope
- No content, copy, layout, color, font, or component changes.
- No edits to Home, Portfolio, Index, or navigation.

### Verification
After the edit, the About page should render at true 1:1 on a 390px viewport with no horizontal scroll and no browser auto-shrink.
