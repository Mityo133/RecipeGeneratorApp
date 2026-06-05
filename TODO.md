Act as an expert Senior UI/UX Designer and Frontend Engineer specializing in Next.js, Tailwind CSS, and Framer Motion. 

I need to completely redesign the user interface of my web application, "RecipeGeneratorApp". The goal is to transform it into a highly premium, clean, user-friendly, and incredibly smooth digital experience. 

Please provide the structural layout guidelines, global Tailwind configuration updates, and implementation patterns based on the design system below:

---

### 🌟 1. Theme & Color Palette (The "Midnight Velvet" Concept)
We are moving away from harsh pure blacks and flat interfaces, shifting toward a luxurious, high-contrast dark mode with glowing accents:
- **Base Background:** Deep Obsidian Black (`#09090b` / Tailwind `zinc-950`)
- **Surface/Card Elements:** Translucent dark zinc with a glassmorphism blur (`zinc-900/60` with `backdrop-blur-md`) and a subtle boundary border (`white/[0.04]`).
- **Primary / Brand Accent:** Vibrant Cyber Cyan (`#22d3ee` / Tailwind `cyan-400`) — used for high-importance interactions, focus rings, and primary highlights.
- **Secondary / Creative Accent:** Deep Electric Purple (`#a855f7` / Tailwind `purple-500`) — used to signify AI features, generation workflows, and decorative glows.
- **Muted Elements:** Sleek slate-zinc grays (`zinc-400` / `zinc-500`) for secondary text and structural borders.

### ✨ 2. Smooth Animations & Motion Design System
All animations must feel fluid, intentional, and physics-based rather than abrupt or linear. Provide configuration details or Framer Motion properties for:
- **Page Transitions:** Gentle fade-ins combined with a slight upward slide (`y: [10, 0]`, `opacity: [0, 1]`) using an elegant spring curve.
- **Button & Interactive States:** Micro-interactions on hover (`scale: 1.02`, subtle increase in border opacity) and active click states (`scale: 0.98`).
- **Loading Mechanics:** The spinning loader (`Loader2`) should feel alive. Pair the spinning icon with an underlying slow-pulsing radial glow (`scale: [0.95, 1.05]`) to make waiting feel premium and lightweight.

### 🧱 3. UX & UI Cleanliness Structural Enhancements
- **Clarity at a Glance:** The Action Bar (containing the "Browse Feed", "Edit", and "Delete" elements) needs a balanced structural layout. Use an elegant `flex items-center justify-between` layout to push utility navigation to the left and critical destructive/constructive actions cleanly to the right.
- **Action Hierarchy:** - The "Delete" button should not be an aggressive solid red blocks right away. Give it a subtle outline or secondary style that changes to a clean, soft crimson on hover.
  - The "Edit" button should use a sleek secondary border or a rich deep purple/indigo accent.
- **Layout Spacing:** Introduce intentional white space (using responsive padding like `px-6 py-8 md:p-10`) to allow typography and recipe card assets room to breathe.

---

### 💻 Target Output Requirement
Based on these aesthetic choices, please generate or update the Next.js Client Component code for my recipe detail page. Ensure the layout remains perfectly scannable, incorporates these precise Tailwind classes, maps the animation definitions cleanly, and checks against the correct backend database casing schema (`recipe.recipe?.user_ID`).