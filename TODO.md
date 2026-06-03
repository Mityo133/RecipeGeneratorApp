# TODO — Responsive Redesign (Mobile-first, fluid layouts)

## Plan summary
- Update global typography + container utilities for fluid spacing.
- Update app shell layout (header + main container) to use fluid containers.
- Improve Navbar spacing and drawer padding with fluid units.
- Redesign Home page (`house.tsx`) grids and hero typography to be fluid + auto-fit.
- Redesign Recipe Details card (`ult/card.tsx`) to replace breakpoint grids with auto-fit where appropriate, and ensure mobile/tablet stack appropriately.

## Steps
1. Add fluid typography + container utility classes to `my-app/app/style/globals.css`.
2. Update `my-app/app/layout.tsx` to use new container + section padding utilities.
3. Update `my-app/app/components/Navbar/Navbar.tsx` for fluid header height/padding and drawer spacing.
4. Update `my-app/app/components/house.tsx`:
   - replace fixed hero glow sizes with `clamp()`/viewport-based sizing
   - replace large text sizes with fluid `clamp()`
   - replace `md:grid-cols-3` with auto-fit grid, and ensure mobile/tablet collapse correctly via minmax sizing
5. Update `my-app/app/components/ult/card.tsx`:
   - replace `grid-cols-2 md:grid-cols-4` with auto-fit minmax grids
   - ensure mobile/tablet stacking is clean (min widths tuned)
   - replace fixed aspect ratio behavior for the image hero
6. Validate visually at mobile/tablet/laptop/ultra-wide.

## Progress
- [x] Update Home hero glow sphere sizing (fluid via clamp)
- [x] Update Home hero typography + paragraph sizing (fluid)
- [x] Update Home feature cards grid to auto-fit


