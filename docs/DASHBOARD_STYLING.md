# Dashboard Styling Guide

> This guide documents the bright, playful, pastel aesthetic for the AquaHeart dashboard.

## Design Philosophy

The dashboard follows a **bright, playful, calm, and friendly** design inspired by wellness apps. Key principles:

- **Bright & Airy**: Light backgrounds with plenty of whitespace
- **Pastel Colors**: Soft, friendly color palette for cards and accents
- **Playful Elements**: Emojis, decorative blobs, subtle animations
- **Calm & Organized**: Clean layout with clear visual hierarchy

## Theme Configuration

The dashboard uses **light mode only**. This is configured in `app/layout.tsx`:

```tsx
<html lang="en" className="light">
```

> **Important**: Do not change this to "dark" as the pastel aesthetic is designed for light mode.

---

## Color System

### Pastel Card Colors

| Color Name | CSS Variable | Hex Value | Usage |
|------------|--------------|-----------|-------|
| Sage Green | `--pastel-sage` | `#C5D5CB` | Success states, healthy tanks, water parameters |
| Soft Peach | `--pastel-peach` | `#F5D5C8` | Alerts, warnings, attention items |
| Warm Cream | `--pastel-cream` | `#F5E6D3` | Neutral cards, feeding schedules |
| Soft Yellow | `--pastel-yellow` | `#F5E5A8` | Highlights, new items, badges |
| Lavender | `--pastel-purple` | `#E5DDF0` | Maintenance items, inhabitants count |
| Soft Coral | `--pastel-coral` | `#E8B4A0` | Action buttons, CTAs |

### Background Colors

| Element | Color | Hex |
|---------|-------|-----|
| Page Background | Very Light Blue-Gray | `#F7FAFC` |
| Cards | White | `#FFFFFF` |
| Sidebar | White | `#FFFFFF` |

### Text Colors

| Type | Color | Hex |
|------|-------|-----|
| Primary Text | Dark Gray | `#2D3748` |
| Secondary Text | Medium Gray | `#718096` |
| Muted Text | Light Gray | `#A0AEC0` |

---

## Component Styling

### Stats Cards

Stats cards use pastel backgrounds with white decorative blobs:

```tsx
// Example: Tank count card
<div className="bg-pastel-sage rounded-2xl p-6 relative overflow-hidden">
  {/* Decorative blob */}
  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/30 rounded-full" />
  
  {/* Content */}
  <span className="text-4xl font-bold text-foreground">5</span>
  <span className="text-muted-foreground">Total Tanks</span>
</div>
```

**Color Assignments:**
- Total Tanks: `bg-pastel-sage` (sage green)
- Active Alerts: `bg-pastel-peach` (soft peach)
- Next Water Change: `bg-pastel-cream` (warm cream)
- Total Inhabitants: `bg-pastel-purple` (lavender)

### Tank Cards

Tank cards have white backgrounds with subtle shadows:

```tsx
<Card className="bg-card rounded-[2rem] overflow-hidden shadow-lg hover:scale-[1.02] transition-all">
  {/* Image with gradient overlay */}
  <div className="relative aspect-[4/3]">
    <Image src={tankImage} alt={tankName} fill />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
  </div>
  
  {/* Content */}
  <CardContent className="p-4">
    <h3 className="font-semibold text-foreground">{tankName}</h3>
    <Badge className="bg-pastel-sage text-foreground">Healthy</Badge>
  </CardContent>
</Card>
```

### Activity Section

Activity items use pastel icon backgrounds:

```tsx
<div className="flex items-center gap-4">
  {/* Pastel icon circle */}
  <div className="w-12 h-12 rounded-full bg-pastel-sage flex items-center justify-center">
    <Icon className="w-6 h-6 text-foreground" />
  </div>
  
  {/* Text content */}
  <div>
    <p className="font-medium text-foreground">Water parameters checked</p>
    <p className="text-sm text-muted-foreground">2 hours ago</p>
  </div>
</div>
```

**Icon Background Colors:**
- Water parameters: `bg-pastel-sage`
- Feeding: `bg-pastel-yellow`
- Maintenance: `bg-pastel-purple`
- Alerts: `bg-pastel-peach`

### Care Suggestions

Care suggestion cards combine pastel backgrounds with decorative elements:

```tsx
<div className="bg-pastel-cream rounded-2xl p-6 relative overflow-hidden">
  {/* Decorative blobs */}
  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/20 rounded-full" />
  <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full" />
  
  {/* Content */}
  <h4 className="font-semibold text-foreground">Water Change Due</h4>
  <p className="text-muted-foreground">Reef Tank needs attention</p>
</div>
```

---

## Decorative Elements

### Blob Pattern

Use soft, organic blob shapes for visual interest:

```tsx
{/* Large background blob */}
<div className="absolute -top-20 -right-20 w-64 h-64 bg-pastel-sage/30 rounded-full blur-3xl" />

{/* Small accent blob */}
<div className="absolute bottom-0 left-0 w-16 h-16 bg-white/30 rounded-full" />
```

### Emoji Usage

Include friendly emojis in greetings and interactive elements:

- Hero greeting: "Good morning! 🌊" or "Hi there! 👋"
- Success messages: "Great job! 🎉"
- Tank health: "🐠" for fish, "🌿" for plants

---

## Hover & Animation Effects

### Card Hover

```css
.card-hover {
  @apply transition-all duration-300 hover:scale-[1.02] hover:shadow-lg;
}
```

### Subtle Float Animation

```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}
```

---

## Tailwind Classes Quick Reference

### Backgrounds
```
bg-background    → #F7FAFC (page)
bg-card          → #FFFFFF (cards)
bg-pastel-sage   → #C5D5CB
bg-pastel-peach  → #F5D5C8
bg-pastel-cream  → #F5E6D3
bg-pastel-yellow → #F5E5A8
bg-pastel-purple → #E5DDF0
bg-pastel-coral  → #E8B4A0
```

### Text
```
text-foreground       → #2D3748 (primary)
text-muted-foreground → #718096 (secondary)
```

### Borders
```
border-border → #E2E8F0
rounded-2xl   → 16px
rounded-[2rem] → 32px (large cards)
```

### Shadows
```
shadow-sm  → subtle
shadow-md  → normal cards
shadow-lg  → emphasized cards
```

---

## Visual Reference

The dashboard should match the aesthetic in `dashboard_ref.png`:
- Light, airy background
- Vibrant pastel stat cards
- Clean white tank cards
- Playful decorative elements
- Friendly greeting with emoji

---

## Future Enhancements

When time permits, consider adding:
- Theme toggle (light/dark switch)
- Seasonal color variations
- More micro-interactions
- Animated decorative illustrations
- Health score widget with visual indicators
