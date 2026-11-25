# ETHShala Design System & Style Guide

> **Canonical Source of Truth**: This document defines the visual design system of ETHShala, derived exclusively from the Home Page (`apps/web/app/page.tsx` and `apps/web/app/components/landing/*`). All pages, features, and components across the platform must follow these specifications.

---

## 1. Design Vision: "Campus Editorial & Academic Zine"

ETHShala’s visual identity is **"Campus Editorial meets Modern Craft"**. It embodies the energetic atmosphere of university campuses, collaborative workshops, student newspapers, and physical zines, blended with crisp modern interface engineering.

### Guiding Principles
- **Tactile & Physical**: Use tangible real-world metaphors—polaroids with thick white borders, frosted scotch-tape strips, post-it notes, stepped card stacks, and physical badge cutouts.
- **Academic Editorial**: High-contrast, bold display headlines paired with warm paper-toned backgrounds and clean sans-serif body copy.
- **Human Marginalia**: Handwritten notes, casual annotations, directional arrows, and squiggles using Google Font **Caveat** that look like a student scrawled them in the margins of a notebook.
- **Organic Flow & Rhythm**: Alternating sections of warm ivory/paper and deep pine/obsidian, connected seamlessly by organic wave dividers.
- **Solid Elevation**: No blurry cyber-glows or generic floating glassmorphism. Surfaces use solid, punchy colors, crisp borders, and retro hard-offset drop shadows (`5px 5px 0px`).

---

## 2. Color Palette & Token System

### 2.1 Backgrounds & Canvases
| Token Name | Hex Code | Tailwind Class / Role | Notes |
| :--- | :--- | :--- | :--- |
| **Paper Ivory** | `#fcfbf7` | `bg-[#fcfbf7]` | Primary warm background; feels like parchment/editorial paper. |
| **Clean Off-White** | `#fdfdfc` | `bg-[#fdfdfc]` | High-contrast secondary light surface. |
| **Campus Cream** | `#f7f8f2` | `bg-[#f7f8f2]` | Warm neutral canvas tone for network/community sections. |
| **Obsidian Pine** | `#06100e` | `bg-[#06100e]` | Deep dark surface with subtle pine undertones. |
| **Midnight Forest** | `#0d1f1a` | `bg-[#0d1f1a]` | Deep, moody forest background for contrasting hero sections. |
| **Core Pine Dark** | `#0a1a16` | `bg-[#0a1a16]` | Solid dark green anchor for buttons, cards, and diagram nodes. |

### 2.2 Brand Greens (Primary & Accents)
| Token Name | Hex Code | Tailwind Class / Role | Usage |
| :--- | :--- | :--- | :--- |
| **Deep Forest Green** | `#075945` | `text-[#075945]` | Headline emphasis, bold text links. |
| **Foliage Green** | `#0e7955` | `text-[#0e7955]`, `border-[#0e7955]` | Subsection titles, hard-shadow offsets. |
| **Primary Pine Button** | `#064a3a` | `bg-[#064a3a] hover:bg-[#043328]` | Primary CTA button background. |
| **Mint Highlight** | `#61d9b9` | `text-[#61d9b9]` | Text highlights and arrows on dark surfaces. |
| **Teal Mint Accent** | `#48d6b2` | `stroke-[#48d6b2]` | Squiggly underlines on dark backgrounds. |
| **Emerald Leaf** | `#34d399` | `bg-[#34d399]` | Hand-drawn underline accents. |
| **Pale Mint Badge** | `#d8f0dd` | `bg-[#d8f0dd]` | Category pill and event tag background. |

### 2.3 Sunflower Gold & Amber (Signature Accent)
Yellow brings warmth, student energy, and high editorial contrast.
| Token Name | Hex Code | Tailwind Class / Role | Usage |
| :--- | :--- | :--- | :--- |
| **Sunflower Gold** | `#f8bd36` | `stroke-[#f8bd36]`, `text-[#f8bd36]` | Squiggly underlines, handwritten arrows, dots. |
| **Goldenrod Tag** | `#ffd359` | `bg-[#ffd359]` | Event date pill card background. |
| **Amber Ochre** | `#f1c84b` | `text-[#f1c84b]` | Card sub-eyebrow and location tag. |
| **Sticky Note Canary** | `#f8e099` | `bg-[#f8e099]` | Post-it note background. |

### 2.4 Event & Category Pastel System
Used for category badges, event cards, and tags:
- **Sunflower Yellow**: `#ffd359` (`text-[#111]`)
- **Soft Periwinkle / Lavender**: `#dfdbfc` (`text-[#111]`)
- **Pale Mint Green**: `#d8f0dd` (`text-[#111]`)

### 2.5 Neutral Typography & Borders
- **Headline Black**: `#111111` / `#171a18` (high-contrast text on light backgrounds)
- **Body Charcoal**: `#333333` (primary body text, warm and readable)
- **Muted Body**: `#444444` / `#555555` / `#666666` (secondary descriptions)
- **Eyebrow Gray**: `#666963` / `#888888` (uppercase tracking overlines)
- **Warm Light Border**: `#d8d6ce` / `#dcdad3` / `#e5e7eb`
- **Dark Section Border**: `rgba(255, 255, 255, 0.15)` to `rgba(255, 255, 255, 0.25)`

---

## 3. Typography System

The typography creates a deliberate dialogue between structured editorial authority and playful student marginalia.

### 3.1 Font Families
1. **Headings & Display**: `Space Grotesk` (or `Clash Display`).
   - Weight: `800` (Extrabold) or `900` (Black).
   - Letter Spacing: `tracking-tight` (or `tracking-[-0.035em]`).
   - Line Height: Extremely tight: `leading-[0.92]` to `leading-[1.05]`.
2. **Handwritten Marginalia & Doodles**: Google Font `Caveat` (`"Caveat", cursive`).
   - Import: `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');`
   - Weight: `600` or `700` (Semi-bold / Bold).
   - Usage: Casual marginalia, sticky note text, directional arrow captions, angled stamps.
3. **Body Text**: `Inter` or modern geometric sans (`font-sans`).
   - Weight: `font-medium` (500).
   - Line Height: `leading-[1.4]` to `leading-[1.6]`.
   - Sizes: `text-[15px]` to `text-[18px]` for comfortable, bookish legibility.
4. **Eyebrows & Micro-labels**:
   - Styling: `text-[10px]` to `text-[12px] font-bold uppercase tracking-[0.2em]` to `tracking-[0.25em]`.

### 3.2 Typography Scale & Hierarchy

| Role | Tailwind Classes | Sample Text |
| :--- | :--- | :--- |
| **Hero Display 1** | `text-[clamp(3.5rem,7vw,6.5rem)] font-black leading-[0.92] tracking-tight` | `Ethereum, on campus.` |
| **Section Title** | `text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.05] tracking-tight` | `Students who build communities.` |
| **Subsection Title**| `text-[clamp(1.8rem,3vw,2.4rem)] font-extrabold leading-[1.1] tracking-tight` | `Growing one campus at a time.` |
| **Handwritten Note**| `font-bold text-2xl md:text-3xl leading-none` with `fontFamily: '"Caveat", cursive'` | `Students Build Communities` |
| **Lead Paragraph** | `text-[17px] lg:text-[19px] font-medium leading-[1.4] text-[#333]` | `Bringing Ethereum learning, events & communities...` |
| **Body Standard** | `text-[15px] font-medium leading-[1.6] text-[#444]` | `Structured modules, quizzes and resources...` |
| **Eyebrow Label** | `text-[11px] font-bold uppercase tracking-[0.25em] text-[#666963]` | `CAMPUS AMBASSADOR PROGRAM` |

---

## 4. Signature Editorial & Craft Motifs

These core visual elements must be used throughout the app to maintain the home page's unique feel.

### 4.1 Hand-Drawn Squiggly Underlines
Used under key headline phrases for human emphasis.

**On Light Backgrounds (Sunflower Gold):**
```tsx
<span className="relative inline-block text-[#075945]">
  on campus.
  <svg
    aria-hidden="true"
    viewBox="0 0 360 24"
    className="absolute -bottom-5 left-0 w-full overflow-visible"
    fill="none"
  >
    <path
      d="M3 16C78 5 189 3 353 9M14 21C108 13 236 9 326 13"
      stroke="#f8bd36"
      strokeLinecap="round"
      strokeWidth="5"
    />
  </svg>
</span>
```

**On Dark Backgrounds (Mint Highlight):**
```tsx
<svg
  aria-hidden="true"
  viewBox="0 0 220 22"
  className="absolute bottom-2 left-[5%] w-[90%] overflow-visible"
  fill="none"
>
  <path
    d="M3 16C55 3 145 4 215 7M24 21C88 11 159 8 191 11"
    stroke="#48d6b2"
    strokeLinecap="round"
    strokeWidth="4"
  />
</svg>
```

### 4.2 Scotch-Tape Strips
Translucent tape overlays that visually "pin" cards or photos to the page.

```tsx
{/* White frosted scotch tape */}
<div className="absolute -top-3 left-[20%] w-24 h-8 bg-white/50 backdrop-blur-md transform rotate-[-4deg] shadow-sm mix-blend-screen" />

{/* Mint-tinted scotch tape */}
<div className="absolute -top-4 left-[10%] w-20 h-6 bg-[#93cba3]/80 backdrop-blur-sm shadow-sm transform rotate-[-15deg]" />

{/* Green tape on post-it */}
<div className="absolute -top-3 left-[35%] w-14 h-5 bg-[#4ade80] rotate-[-15deg] shadow-sm rounded-sm opacity-90" />
```

### 4.3 Polaroid & Framed Physical Photos
Images feature thick white borders, slight organic rotations, and drop shadows.

```tsx
<div className="relative bg-[#e3dfd3] border-[8px] border-white shadow-xl transform rotate-[2deg] overflow-hidden">
  <img src="/events/event.png" alt="Event" className="w-full h-full object-cover" />
  {/* Add a tape piece above */}
</div>
```

### 4.4 Organic Wavy Section Dividers
Smooth SVG curves transitioning between contrasting light and dark sections.

```tsx
{/* Wavy bottom edge joining dark (#0d1f1a) into light (#fcfbf7) */}
<svg 
  className="absolute bottom-0 left-0 w-full h-[60px] md:h-[120px] text-[#fcfbf7] translate-y-[1px]" 
  viewBox="0 0 1440 120" 
  fill="currentColor" 
  preserveAspectRatio="none"
>
  <path d="M0,80 C480,-40 960,200 1440,80 L1440,120 L0,120 Z" />
</svg>
```

### 4.5 Post-it Sticky Notes with Pin-Tape
A tilted yellow sticky note for editorial notes, quotes, or tips.

```tsx
<div
  className="relative w-[160px] rotate-[10deg] bg-[#f8e099] p-5 pt-7 text-[21px] font-bold leading-[1.15] text-[#222] shadow-[4px_8px_16px_rgba(0,0,0,0.12)] rounded-sm"
  style={{
    fontFamily: '"Caveat", cursive',
    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)'
  }}
>
  <div className="absolute top-2.5 left-2.5 w-1 h-1 rounded-full bg-black/15" />
  <div className="absolute -top-3 left-[35%] w-14 h-5 bg-[#4ade80] rotate-[-15deg] shadow-sm rounded-sm opacity-90" />
  From<br />curiosity<br />to contribution.
</div>
```

### 4.6 Hard-Offset Retro Shadows (Diagram / Node Cards)
Solid offset shadows instead of blurry ambient blurs:

```tsx
<div className="w-[180px] bg-white rounded-xl p-4 shadow-[5px_5px_0px_#0e7955] border-2 border-gray-100 transform rotate-[-2deg]">
  <div className="flex items-center gap-2 mb-2">
    <span className="text-[12px] font-bold uppercase tracking-wider text-[#111]">Learning</span>
  </div>
  <p className="text-[11px] font-medium text-[#666] leading-snug">EIPs, Ethereum, Governance & more</p>
</div>
```

### 4.7 Stepped / Cascading Card Decks
Overlapping cards with staggered margin-left:

```tsx
{events.map((event, index) => (
  <div
    key={event.title}
    className={`${event.color} flex items-center gap-3 rounded-xl px-4 py-2.5 shadow-[0_8px_25px_rgba(0,0,0,0.08)] transform transition-transform hover:-translate-y-1`}
    style={{ marginLeft: `${index * 12}px` }}
  >
    {/* Content */}
  </div>
))}
```

### 4.8 Blueprint / Campus Grid Texture
Subtle background grid overlay for analytical or architectural depth:

```tsx
<div 
  className="absolute inset-0 opacity-[0.05] pointer-events-none" 
  style={{ 
    backgroundImage: 'linear-gradient(#0e7955 1px, transparent 1px), linear-gradient(90deg, #0e7955 1px, transparent 1px)', 
    backgroundSize: '40px 40px' 
  }} 
/>
```

---

## 5. Layout & Spatial System

### 5.1 Container Max Widths
- **Full Showcase Hero**: `max-w-[1400px]` with `px-5 sm:px-8 lg:px-12`
- **Standard Content & Grids**: `max-w-7xl` (`1280px`) with `px-4 sm:px-6 lg:px-8`
- **Reading / Narrow Sections**: `max-w-[1200px]` with `px-6 lg:px-10`

### 5.2 Section Alternation
Always alternate light and dark environments to maintain energy:
1. **Light Hero**: Paper Ivory (`#fcfbf7`) with high-contrast text and sunflower accents.
2. **Dark Block**: Midnight Forest (`#0d1f1a`) or Obsidian Pine (`#06100e`) with wavy top/bottom transitions.
3. **Light Content**: Clean Off-White (`#fdfdfc`) with 40px blueprint grid.
4. **Dark Anchor / Footer**: Obsidian Pine (`#06100e`) or Midnight Green with clean border lines.

---

## 6. Component Specifications & Tailwind Recipes

### 6.1 Buttons

#### Primary CTA (Dark Pine)
```tsx
<Link
  href="/community"
  className="group inline-flex min-h-[48px] items-center gap-3 rounded-lg bg-[#064a3a] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#043328] shadow-md"
>
  Partner with us
  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
</Link>
```

#### Primary Deep Anchor
```tsx
<Link
  href="/dashboard/cap"
  className="group inline-flex min-h-[52px] items-center gap-3 rounded-lg bg-[#0a1a16] px-7 text-[15px] font-semibold text-white transition-colors hover:bg-[#15382f] shadow-lg"
>
  Become a Campus Ambassador
  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
</Link>
```

#### Secondary Outline Button (Light Surface)
```tsx
<Link
  href="/about"
  className="group inline-flex min-h-[52px] items-center gap-3 rounded-lg border-2 border-[#e5e7eb] bg-white px-7 text-[15px] font-semibold text-[#111] transition-colors hover:border-[#d1d5db] hover:bg-[#f9fafb]"
>
  Talk to us
  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
</Link>
```

#### Circular Arrow Navigation Button
```tsx
<button
  type="button"
  aria-label="Scroll"
  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white hover:text-white"
>
  <ArrowRight size={20} />
</button>
```

---

### 6.2 Cards & Containers

#### 1. Event Date Stamp Card
```tsx
<div className="bg-[#ffd359] flex items-center gap-3 rounded-xl px-4 py-2.5 shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
  <div className="w-12 shrink-0 text-center leading-none border-r border-black/10 pr-3">
    <span className="block text-[22px] font-black text-[#111]">27</span>
    <span className="mt-1 block text-[9px] font-bold text-[#333] tracking-[0.2em]">AUG</span>
  </div>
  <div className="min-w-0 flex-1">
    <p className="truncate text-[13px] font-bold text-[#111] leading-tight">Ethereum, EIPs, and Web3</p>
    <p className="mt-1 truncate text-[11px] font-medium text-[#444] leading-tight">HETC College</p>
  </div>
  <ArrowRight size={18} className="shrink-0 text-[#111]" />
</div>
```

#### 2. Media Story Card (Featured Carousel)
```tsx
<div className="group relative flex h-[320px] w-[320px] shrink-0 flex-col justify-end overflow-hidden rounded-xl bg-[#1d2925] shadow-lg">
  <img src="/events/event.png" alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
  <div className="absolute inset-0 bg-gradient-to-t from-[#06100e]/90 via-[#06100e]/30 to-transparent" />
  <div className="p-5 relative z-10">
    <p className="mb-2 text-[11px] font-bold tracking-wide text-[#f1c84b]">Heritage Institute</p>
    <h3 className="line-clamp-3 text-[16px] font-bold leading-[1.3] text-white">Students gather for EIP Hackathon</h3>
    <p className="mt-3 text-[11px] text-white/90 font-medium">Aug 2026</p>
  </div>
</div>
```

#### 3. Flowchart Central Hub Card
```tsx
<div className="w-[280px] bg-[#0a1a16] rounded-xl p-5 text-center shadow-2xl border-[3px] border-[#0a1a16]">
  <h3 className="text-4xl font-extrabold text-white tracking-tight">ETHShala</h3>
  <p className="text-[10px] font-bold tracking-[0.2em] text-white/80 mt-2 uppercase">Learn \ Build \ Contribute</p>
</div>
```

---

### 6.3 Overlapping Avatar Group & Social Proof
```tsx
<div className="flex items-center gap-4">
  <div aria-hidden="true" className="flex -space-x-3">
    {avatars.map((avatar) => (
      <img
        key={avatar}
        src={avatar}
        alt=""
        className="h-10 w-10 rounded-full border-[3px] border-[#fcfbf7] shadow-sm object-cover"
      />
    ))}
  </div>
  <p className="text-[13px] leading-[1.3] text-[#555] font-medium max-w-[150px]">
    <span className="font-extrabold text-[#111] text-[15px]">200+</span> Students reached across campuses
  </p>
</div>
```

---

### 6.4 Navigation Bar (Header)
- **Position**: Sticky/fixed at `top-0 left-0 right-0 z-50`.
- **Background**: `bg-background/90 backdrop-blur-xl border-b border-border`.
- **Height**: `h-16` (`64px`).
- **Links**: `text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent px-3.5 py-1.5 rounded-lg`.
- **Right CTA**: Clean outlined button (`border border-border text-foreground hover:bg-accent px-4 py-2 rounded-lg text-sm font-semibold`) or primary green.

---

### 6.5 Footer
- **Background**: Clean `bg-background border-t border-border py-16`.
- **Headings**: `text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-5`.
- **Social Icon Tiles**: `h-11 w-11 rounded-xl border border-border/70 bg-card text-foreground hover:border-emerald-400/60 hover:text-emerald-400`.
- **Sign-off**: `Build With Heart by Avarch`.

---

## 7. Motion & Interaction Rules

1. **Hover Lift**: Interactive cards lift slightly on hover: `transition-transform duration-200 hover:-translate-y-1`.
2. **Arrow Translation**: Buttons with `ArrowRight` or `ArrowUpRight` translate on group hover: `group-hover:translate-x-1`.
3. **Card Tilt Physics**: Large imagery, ID cards, and post-its use deliberate rotation angles (`rotate-[-8deg]`, `rotate-[12deg]`, `rotate-[2deg]`, `rotate-[-4deg]`) to evoke physical items resting on a table.
4. **Reduced Motion**: Respect `@media (prefers-reduced-motion: reduce)` by disabling floats and marquee animations.
