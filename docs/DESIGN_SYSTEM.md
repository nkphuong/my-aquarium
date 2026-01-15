# AquaCompanion Design System

> Extracted from reference images: `login_ref.png` and `dashboard_ref.png`

## Design Philosophy

**Keywords:** Bright, Modern, Playful, Cute, Calm, Friendly

The design combines:
- **Ocean/underwater theme** for authentication pages (immersive, welcoming)
- **Soft pastel dashboard** for main app (clean, organized, friendly)

---

## Color Palette

### Primary Colors (Ocean Theme - Auth Pages)
| Name | Hex | Usage |
|------|-----|-------|
| Ocean Deep | `#1E6B8C` | Primary buttons, key actions |
| Ocean Mid | `#4A9EBF` | Secondary elements, links |
| Ocean Light | `#7CC4E4` | Hover states, accents |
| Sky Blue | `#B8E4F0` | Backgrounds, gradients |
| Ocean Mist | `#E8F6FA` | Light backgrounds |

### Secondary Colors (Dashboard Pastels)
| Name | Hex | Usage |
|------|-----|-------|
| Sage Green | `#C5D5CB` | Card backgrounds, success states |
| Soft Peach | `#F5D5C8` | Accent cards, notifications |
| Warm Cream | `#F5E6D3` | Card backgrounds |
| Soft Yellow | `#F5E5A8` | Highlights, badges |
| Muted Purple | `#E5DDF0` | Card backgrounds |
| Soft Coral | `#E8B4A0` | Action buttons, CTAs |

### Neutral Colors
| Name | Hex | Usage |
|------|-----|-------|
| Text Primary | `#2D3748` | Headings, body text |
| Text Secondary | `#718096` | Subtitles, captions |
| Text Muted | `#A0AEC0` | Placeholders, disabled |
| Background | `#F7FAFC` | Page background |
| Card White | `#FFFFFF` | Card backgrounds |
| Border Light | `#E2E8F0` | Borders, dividers |

---

## Typography

### Font Family
- **Primary:** Inter, system-ui, sans-serif (clean, modern, friendly)
- **Fallback:** -apple-system, BlinkMacSystemFont, Segoe UI

### Font Sizes
| Name | Size | Weight | Usage |
|------|------|--------|-------|
| Display | 32px | 700 | Page titles, hero text |
| Heading 1 | 24px | 600 | Section headers |
| Heading 2 | 20px | 600 | Card titles |
| Heading 3 | 16px | 600 | Subsections |
| Body | 14px | 400 | Regular text |
| Small | 12px | 400 | Captions, labels |
| Tiny | 10px | 500 | Badges, tags |

### Line Heights
- Headings: 1.2
- Body: 1.5
- Relaxed: 1.75

---

## Spacing System

Based on 4px base unit:
| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Tight spacing, icon gaps |
| sm | 8px | Inline elements |
| md | 16px | Standard padding |
| lg | 24px | Section spacing |
| xl | 32px | Large gaps |
| 2xl | 48px | Section separators |
| 3xl | 64px | Page sections |

---

## Border Radius

| Name | Value | Usage |
|------|-------|-------|
| sm | 6px | Small buttons, inputs |
| md | 12px | Cards, standard elements |
| lg | 16px | Large cards, modals |
| xl | 24px | Feature cards, panels |
| full | 9999px | Pills, avatars, badges |

---

## Shadows

```css
/* Soft shadow for cards */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.08);

/* Colored shadows for pastel cards */
--shadow-sage: 0 4px 12px rgba(197, 213, 203, 0.4);
--shadow-peach: 0 4px 12px rgba(245, 213, 200, 0.4);
--shadow-ocean: 0 4px 12px rgba(78, 158, 191, 0.3);
```

---

## Components

### Buttons

**Primary Button (Ocean)**
- Background: Ocean Deep (`#1E6B8C`)
- Text: White
- Border Radius: full (pill shape)
- Padding: 12px 24px
- Hover: Ocean Mid (`#4A9EBF`)
- Shadow: shadow-ocean on hover

**Secondary Button**
- Background: White
- Border: 1px solid Border Light
- Text: Text Primary
- Border Radius: full
- Hover: Background (`#F7FAFC`)

**Pastel Button (Dashboard)**
- Background: Soft Coral (`#E8B4A0`)
- Text: Text Primary
- Border Radius: md (12px)
- Padding: 10px 20px

### Cards

**Standard Card**
```css
background: white;
border-radius: 16px;
padding: 20px;
box-shadow: var(--shadow-md);
```

**Pastel Card (Dashboard)**
```css
background: var(--pastel-color); /* sage, peach, cream, etc */
border-radius: 16px;
padding: 20px;
box-shadow: none;
```

**Feature Card**
```css
background: white;
border-radius: 24px;
padding: 24px;
box-shadow: var(--shadow-lg);
```

### Inputs

**Standard Input**
- Background: White
- Border: 1px solid Border Light
- Border Radius: md (12px)
- Padding: 12px 16px
- Focus: Border Ocean Mid, subtle ocean shadow

### Sidebar (Dashboard)

- Background: White or very light cream
- Width: 240px
- Padding: 24px 16px
- Nav items: 12px padding, full border-radius on hover
- Active item: Sage Green background
- Icons: 20px, Text Secondary color
- Logo: Top with playful icon

### Navigation Items
```css
padding: 12px 16px;
border-radius: 12px;
color: var(--text-secondary);
transition: all 0.2s;

/* Hover */
background: var(--background);
color: var(--text-primary);

/* Active */
background: var(--sage-green);
color: var(--text-primary);
```

---

## Decorative Elements

### Ocean Theme (Auth Pages)
- **Wave shapes:** Organic SVG waves at bottom of page
- **Gradient background:** Sky Blue → Ocean Light (top to bottom)
- **3D illustrations:** Cute sea creatures (whale, fish, octopus, jellyfish, coral)
- **Bubbles:** Subtle floating bubble animations

### Dashboard Decorations
- **Organic blobs:** Soft, irregular shapes in background
- **Squiggly lines:** Thin decorative lines (sage green, muted tones)
- **Emoji:** Friendly emoji in greetings (e.g., "Hi, User! 👋")
- **Illustrations:** Simple, flat illustrations for empty states

---

## Layout Patterns

### Auth Pages (Login/Register)
```
┌─────────────────────────────────────┐
│     [Ocean gradient background]     │
│                                     │
│    ┌─────────────────────────┐      │
│    │    [3D Illustration]    │      │
│    │                         │      │
│    │  ┌─────────────────┐    │      │
│    │  │   Login Form    │    │      │
│    │  │   (white card)  │    │      │
│    │  └─────────────────┘    │      │
│    └─────────────────────────┘      │
│                                     │
│  ～～～～～～～～～～～～～～～～～～  │
│     [Wave decoration at bottom]     │
└─────────────────────────────────────┘
```

### Dashboard
```
┌──────┬──────────────────────────────┐
│      │  Hi, User! 👋                │
│ SIDE │  [Subtitle text]             │
│ BAR  │                              │
│      │  ┌────┐ ┌────┐ ┌────┐        │
│ Nav  │  │Card│ │Card│ │Card│        │
│ Items│  └────┘ └────┘ └────┘        │
│      │                              │
│      │  ┌────┐ ┌────┐               │
│      │  │Card│ │Card│  [Widget]     │
│      │  └────┘ └────┘               │
└──────┴──────────────────────────────┘
```

---

## Animation Guidelines

- **Duration:** 150ms-300ms for interactions
- **Easing:** ease-out for enter, ease-in for exit
- **Hover effects:** Subtle scale (1.02) or shadow increase
- **Page transitions:** Fade in (200ms)
- **Loading:** Gentle pulse or skeleton shimmer

---

## Accessibility

- Minimum contrast ratio: 4.5:1 for text
- Focus states: Visible outline (Ocean Mid color)
- Touch targets: Minimum 44x44px
- Alt text for all illustrations

---

## File References

- Login inspiration: `/login_ref.png`
- Dashboard inspiration: `/dashboard_ref.png`

---

## Dashboard Theme

The dashboard uses **light mode only** with a bright, playful, pastel aesthetic.

### Theme Configuration
```tsx
// app/layout.tsx
<html lang="en" className="light">
```

### Pastel Color Assignments
| Card Type | CSS Variable | Color |
|-----------|--------------|-------|
| Total Tanks | `bg-pastel-sage` | Sage Green |
| Active Alerts | `bg-pastel-peach` | Soft Peach |
| Next Water Change | `bg-pastel-cream` | Warm Cream |
| Total Inhabitants | `bg-pastel-purple` | Lavender |

### Key Patterns
- **Stats Cards**: Pastel backgrounds with white decorative blobs
- **Tank Cards**: White background, subtle shadows, hover scale effect
- **Activity Icons**: Pastel circular backgrounds
- **Decorative Elements**: Organic blobs, emoji in greetings

See [DASHBOARD_STYLING.md](DASHBOARD_STYLING.md) for comprehensive styling documentation.

---

## Implementation Notes

1. **Auth pages** should feel immersive with the ocean theme
2. **Dashboard** should feel organized, clean, and friendly
3. Use pastel cards to categorize different types of content
4. Keep plenty of whitespace - don't crowd elements
5. Greeting with user name + emoji creates warmth
6. Decorative elements should be subtle, not distracting
