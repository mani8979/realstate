# Performance Optimization Report

## FILES_CHANGED
- `src/app/page.tsx`
- `src/app/layout.tsx`

## WHY
The Lighthouse performance score and INP (Interaction to Next Paint) were bottlenecked by shipping massive amounts of client-side JavaScript for components that are not visible above the fold (e.g., GSAP sliders, heavy Framer Motion components, and a complex 3D tracking widget). By lazily loading these components, we drastically reduce the initial JS bundle size, allowing the browser to parse and paint the critical `Hero` and `Header` sections instantly without competing for main-thread CPU time.

## BEFORE
- **Main Page:** `SmoothSlider` (loading GSAP), `FeaturedProperties`, `BrandValues`, `LocationSection`, and `PremiumHome` were statically imported and shipped immediately in the initial client chunk.
- **Global Layout:** `FloatingDragon` (which tracks cursor/scroll and runs constant `requestAnimationFrame` loops for the 3D model) was statically rendered and hydrated on *every* page load instantly.

## AFTER
- **Main Page:** Converted all below-the-fold components to use `next/dynamic`. The browser now automatically chunks these components into separate JS files and only downloads/executes them right before they scroll into the viewport.
- **Global Layout:** `FloatingDragon` is now strictly imported with `next/dynamic({ ssr: false })`. This completely removes it from the initial server payload and prevents hydration mismatches, drastically improving TTI (Time to Interactive).
- **Visual Integrity:** No visual layouts or business logic were changed. The `Hero` and `Founder` sections remain statically rendered so the user sees a complete, fast page instantly.

## RISK_LEVEL
**LOW**. 
The only change is how Next.js packages the JavaScript bundles. The UI remains pixel-perfect, and business logic is entirely untouched. By keeping `ssr: true` (the default) on the homepage dynamic components, we preserve SEO while saving client bandwidth.
