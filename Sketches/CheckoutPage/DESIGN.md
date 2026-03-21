# Design System Document: High-End Agency Portal

## 1. Overview & Creative North Star
**The Creative North Star: "The Obsidian Lens"**

This design system is built to move beyond the "generic SaaS" aesthetic. It treats the interface not as a flat screen, but as a series of deep, physical layers of polished obsidian and frosted glass. By leveraging intentional asymmetry and high-contrast typography, we create an editorial experience that feels curated rather than templated. We eschew traditional grid-bound thinking in favor of overlapping elements and "breathing" layouts that prioritize focus and premium prestige.

## 2. Colors & Surface Soul
The palette is rooted in a deep, atmospheric dark mode, punctuated by a high-energy kinetic gradient.

### Color Palette (Material Design Convention)
*   **Base Background:** `#0e0e13` (Surface)
*   **Primary Accent:** `#bd9dff` (Light Violet)
*   **Secondary Accent:** `#fd761a` (Vibrant Orange)
*   **Signature Gradient:** `#7c3aed` (Purple) → `#f97316` (Orange)

### The "No-Line" Rule
Standard 1px solid borders are strictly prohibited for sectioning. Structural boundaries must be defined solely through:
1.  **Background Shifting:** A `surface-container-low` section sitting on a `surface` base.
2.  **Tonal Transitions:** Moving from `surface-dim` to `surface-bright`.
3.  **Negative Space:** Using the Spacing Scale (e.g., `spacing-12`) to imply separation without physical barriers.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack. Each inner container should shift one tier higher in the surface scale to define importance:
*   **Level 0 (App Base):** `surface` (#0e0e13)
*   **Level 1 (Section Wrappers):** `surface-container-low` (#131319)
*   **Level 2 (Primary Cards):** `surface-container` (#19191f)
*   **Level 3 (Interactive Elements):** `surface-container-high` (#1f1f26)

### The "Glass & Gradient" Rule
To achieve "The Obsidian Lens," use glassmorphism for floating elements (modals, dropdowns, sticky navs). 
*   **Formula:** `surface` color at 60-80% opacity + `backdrop-blur(12px)`.
*   **Signature Glows:** Primary CTAs should utilize the `#7c3aed` → `#f97316` gradient with a 15% opacity drop-shadow in the `primary` color to simulate a neon-luminescent effect.

## 3. Typography: Editorial Authority
We utilize a high-contrast pairing: **Manrope** for expressive, authoritative displays and **Inter** for utilitarian clarity.

*   **Display (Manrope):** Used for hero headers and project titles. The large scale (`display-lg`: 3.5rem) creates a "magazine" feel.
*   **Headline/Title (Manrope/Inter):** Headlines (`headline-lg`: 2rem) should be tight-tracked (-2%) to feel dense and professional.
*   **Body (Inter):** All body text must use `body-lg` or `body-md` with generous line-height (1.6) to ensure readability against the dark background.
*   **Labels (Inter):** Small caps or bold weights for `label-md` are encouraged for metadata, providing a "technical" contrast to the fluid display type.

## 4. Elevation & Depth
Depth is a narrative tool. We do not use "shadows" in the traditional sense; we use **Tonal Layering**.

### The Layering Principle
Place a `surface-container-lowest` card (absolute black) on a `surface-container-low` section to create a "void" effect. Conversely, use `surface-bright` for elements that need to pop forward.

### Ambient Shadows
For floating glass cards, shadows must be:
*   **Color:** `on-surface` (#f9f5fd) at 4% opacity.
*   **Blur:** 40px to 60px.
*   **Offset:** Y: 20px.
This mimics natural light refracting through glass rather than a heavy "drop shadow."

### The "Ghost Border" Fallback
If accessibility requires a border, use the **Ghost Border**:
*   `outline-variant` (#48474d) at 15% opacity. 
*   Never use 100% opaque borders; they break the illusion of depth.

## 5. Components

### Buttons
*   **Primary:** Full gradient (`#7c3aed` → `#f97316`). No border. High-contrast `on-primary-fixed` text.
*   **Secondary:** `surface-container-high` background with a "Ghost Border."
*   **Tertiary:** Ghost text with the `primary` color and a subtle underline on hover.

### Glass Cards
*   **Style:** `surface` color at 15% opacity, `backdrop-blur(16px)`, Ghost Border (10% opacity white).
*   **Rule:** No dividers. Use `spacing-6` between content blocks within the card.

### Custom Dark Inputs
*   **Field:** `surface-container-lowest` (pure black) background. 
*   **Focus State:** The border transitions from 10% white to the `primary` violet, accompanied by a 4px `primary_dim` outer glow.

### Progress Indicators
*   **Track:** `surface-container-highest`.
*   **Indicator:** Linear gradient. For high-end feel, the indicator should have a "trailing glow" (a blurred circle of the same gradient moving at the tip of the progress bar).

### Additional Component: The "Status Orb"
Instead of standard badges, use a 8px blurred circle (Orb) next to project statuses.
*   *Active:* Vibrant `secondary` glow.
*   *Completed:* `primary` glow.
*   *Pending:* `outline` (grey) glow.

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical margins (e.g., 15% left margin, 5% right margin) for editorial layouts.
*   **Do** use overlapping elements (e.g., a glass card partially covering a gradient background glow).
*   **Do** prioritize vertical rhythm using the `spacing-8` (2.75rem) unit for major sections.

### Don't:
*   **Don't** use 1px solid lines to separate list items. Use a background shift to `surface-container-low` on hover instead.
*   **Don't** use pure white (#ffffff) for body text. Use `on-surface` (#f9f5fd) to reduce eye strain.
*   **Don't** use "Standard" easing. All transitions must use `cubic-bezier(0.23, 1, 0.32, 1)` (Circ Out) for a "snappy yet smooth" high-end feel.