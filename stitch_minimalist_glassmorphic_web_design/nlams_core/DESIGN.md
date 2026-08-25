---
name: NLAMS Core
colors:
  surface: '#f2fbff'
  surface-dim: '#eee8d5'
  surface-bright: '#f2fbff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e3f7ff'
  surface-container: '#daf2fb'
  surface-container-high: '#d5ecf5'
  surface-container-highest: '#cfe6ef'
  on-surface: '#071e25'
  on-surface-variant: '#404751'
  inverse-surface: '#1e333a'
  inverse-on-surface: '#ddf5fe'
  outline: '#707882'
  outline-variant: '#bfc7d2'
  surface-tint: '#00639b'
  primary: '#006098'
  on-primary: '#ffffff'
  primary-container: '#007abe'
  on-primary-container: '#fdfcff'
  inverse-primary: '#97cbff'
  secondary: '#006a64'
  on-secondary: '#ffffff'
  secondary-container: '#89f5ea'
  on-secondary-container: '#00716a'
  tertiary: '#556200'
  on-tertiary: '#ffffff'
  tertiary-container: '#6c7c00'
  on-tertiary-container: '#fdffe0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cee5ff'
  primary-fixed-dim: '#97cbff'
  on-primary-fixed: '#001d33'
  on-primary-fixed-variant: '#004a76'
  secondary-fixed: '#89f5ea'
  secondary-fixed-dim: '#6cd8ce'
  on-secondary-fixed: '#00201e'
  on-secondary-fixed-variant: '#00504b'
  tertiary-fixed: '#d7ee5e'
  tertiary-fixed-dim: '#bbd144'
  on-tertiary-fixed: '#191e00'
  on-tertiary-fixed-variant: '#414c00'
  background: '#fdf6e3'
  on-background: '#071e25'
  surface-variant: '#cfe6ef'
  emphasis: '#586e75'
  warning: '#b58900'
  danger: '#dc322f'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-page: 40px
  sidebar: 280px
  container-max: 1440px
---

## Brand & Style
The design system for the **National Land Acquisition & Management System (NLAMS)** is defined by the **Solarized Light** ethos: a sophisticated, low-contrast palette designed for long-term productivity and visual comfort in high-density data environments. The brand personality is **authoritative, scholarly, and transparent**, evoking institutional trust through a "digital parchment" aesthetic.

The design style is **Glassmorphic Minimalism**. This approach utilizes the Solarized "Base-dim" tone for semi-transparent layers, creating a sense of professional clarity. The interface feels like a series of refined glass panes organized over a warm, stable foundation, prioritizing functional precision over decorative flair.

**Key visual principles:**
- **Calculated Contrast:** Using specialized Solarized tones to highlight hierarchy without causing visual fatigue.
- **Institutional Transparency:** Glass layers represent the "open-book" nature of land management and government records.
- **Precision Engineering:** Combining soft glass effects with sharp, technical data presentation.

## Colors
This design system utilizes the **Solarized Light** color theory, specifically tuned for a professional government portal.

- **Background:** The primary canvas is `#fdf6e3` (Base), providing a warm, low-strain reading environment.
- **Primary (Blue):** Reserved for primary actions, navigation anchors, and official state indications.
- **Secondary (Cyan):** Used for supporting actions, secondary filters, and technical callouts.
- **Emphasis (Headings):** A darker gray-green (`#586e75`) to ensure typographic hierarchy is distinct from body text.
- **Functional Accents:** Success (`#859900`), Warning (`#b58900`), and Danger (`#dc322f`) follow the Solarized specification to ensure semantic clarity for SLA monitoring and land record status.

## Typography
The system relies on **Inter** to maintain a neutral, highly legible, and modern professional tone. The typography is designed to scale across dense data tables and expansive GIS command views.

- **Headlines:** Rendered in the "Emphasis" color (`#586e75`) with tight tracking for an authoritative, institutional presence.
- **Body:** Rendered in the "Content" color (`#657b83`) to maintain an optimal contrast ratio that is comfortable for prolonged reading.
- **Metadata:** Use `label-caps` for table headers and form labels to create a structured, "filing cabinet" organizational feel.
- **Mobile Adjustments:** For mobile screens, `headline-xl` should reflow to `headline-lg` metrics to maintain layout integrity.

## Layout & Spacing
The layout employs a **Fixed Grid** for administrative dashboards and a **Fluid Content** model for GIS mapping interfaces. All spacing is derived from a `4px` base unit to ensure alignment and rhythmic consistency.

- **Grid:** A 12-column grid on desktop with `24px` gutters. 
- **Margins:** Page-level containers use `40px` margins to provide visual "breathing room" against the warm background.
- **Breakpoints:**
  - **Desktop (1280px+):** Full 12-column visibility.
  - **Tablet (768px - 1279px):** 8-column grid with a collapsed sidebar (hamburger menu).
  - **Mobile (Below 768px):** 4-column fluid grid with `16px` page margins.

## Elevation & Depth
Depth is created through the intersection of transparency and blur, adhering to the glass-morphism aesthetic within the Solarized palette.

- **Base Layer:** The solid `#fdf6e3` background.
- **Glass Surfaces:** Containers use a semi-transparent version of `#eee8d5` (Base-dim) at 70% opacity. This creates a subtle "stepped" look that feels like physical overlays.
- **Backdrop Blur:** All glass containers apply a `20px` blur. In this specific theme, the blur uses the `#fdf6e3` (Base) color to soften the elements behind it, creating a "frosted parchment" effect.
- **Borders:** A 1px solid stroke using a low-opacity version of the Content color (`#657b83`) defines the edges of glass panes without relying on heavy shadows.

## Shapes
The shape language is **Rounded**, using an `8px` (`0.5rem`) base to humanize the institutional nature of the system while remaining professional.

- **Primary Elements:** Buttons and Input fields use the `0.5rem` standard.
- **Large Containers:** Glass cards and GIS overlay panels use `1rem` (rounded-lg) to distinguish major functional sections.
- **Status Indicators:** Chips and badges use pill-shaped (`full`) rounding to separate status data from actionable UI elements.

## Components
Consistent styling across components reinforces the authoritative Solarized identity.

### Buttons
- **Primary:** Solid `#268bd2` (Blue) with `#fdf6e3` text. High contrast for critical actions.
- **Secondary:** Semi-transparent `#eee8d5` background with `#268bd2` text and a thin border.
- **Functional:** Success, Warning, and Danger buttons use their respective Solarized hex codes with white or base-colored text depending on contrast needs.

### Glass Cards
- All dashboard cards must utilize the glass-morphic style: `background: rgba(238, 232, 213, 0.7)` with a `backdrop-filter: blur(20px)`.
- Cards should have a 1px border of `rgba(101, 123, 131, 0.2)`.

### Input Fields
- Inputs use the `#eee8d5` (Base-dim) color for the background with a 1px border. 
- On focus, the border transitions to a 2px `#268bd2` (Blue) ring.
- Labels are strictly `label-caps` for a professional, structured form appearance.

### Status Chips
- Chips use a low-saturation background of the status color (Success/Warning/Danger) with high-saturation text to ensure legibility against the warm base.
- **SLA Breaches:** Use the Danger Red (`#dc322f`) with a subtle inner glow for maximum visibility.