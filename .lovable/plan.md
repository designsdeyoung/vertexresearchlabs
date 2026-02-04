

# Scientific Animations Implementation Plan

This plan adds three visually impressive scientific animations to the homepage: a Molecule Builder, a Purity Dial/Gauge, and a DNA/Peptide Helix. These will reinforce the research-grade, laboratory credibility of the site.

---

## Overview of Changes

| Animation | Location | Trigger |
|-----------|----------|---------|
| Molecule Builder | New section between VialShowcase and ProductCatalog | Scroll into view |
| Purity Dial/Gauge | Hero section (bottom area) or VialShowcase | Scroll into view |
| DNA/Peptide Helix | Hero section background | Continuous rotation + scroll parallax |

---

## 1. Molecule Builder Animation

A visual animation showing a peptide chain being constructed from individual amino acid blocks.

**File**: `src/components/MoleculeBuilder.tsx` (new)

**Features**:
- Individual amino acid "blocks" that snap together sequentially
- Bond lines that draw between connected blocks
- Animated glow effect on the final "complete" state
- Amino acid labels (e.g., Gly, His, Lys) with color coding
- Staggered entrance animations triggered when scrolled into view

**Visual Structure**:
```text
     [Gly] ─── [His] ─── [Lys]
         ↓ bonds draw in sequence
     ┌─────────────────────────┐
     │    Complete Peptide     │
     │    ✨ Glow Effect ✨     │
     └─────────────────────────┘
```

**Animation Sequence**:
1. First amino acid fades in and scales up (0.3s)
2. Bond line draws from first to second position (0.2s)
3. Second amino acid snaps into place (0.3s)
4. Repeat for remaining amino acids
5. Final glow pulse on completion

---

## 2. Purity Dial/Gauge Meter

A circular speedometer-style gauge that sweeps to display 99.62% purity.

**File**: `src/components/PurityDial.tsx` (new)

**Features**:
- SVG-based circular gauge with gradient arc
- Animated needle that sweeps from 0 to target value
- Color gradient zones: red (< 90%) → yellow (90-98%) → green (98%+)
- Tick marks at key thresholds (90%, 95%, 98%, 99%)
- Animated counter displaying current percentage
- Subtle glow effect at the needle tip

**Visual Structure**:
```text
        ╭─────────────╮
       ╱   90  95  99  ╲
      │    ↗ NEEDLE     │
      │      99.62%     │
       ╲               ╱
        ╰─────────────╯
```

**Animation Sequence**:
1. Gauge outline fades in
2. Needle sweeps clockwise from 0 to 99.62% (1.5s ease-out)
3. Counter increments in sync with needle
4. Glow pulse when reaching final value

---

## 3. DNA/Peptide Helix Animation

A 3D-style rotating double helix with pulsing amino acid nodes.

**File**: `src/components/DNAHelix.tsx` (new)

**Features**:
- CSS 3D transforms for pseudo-3D helix rotation
- Two intertwined strands with connecting "rungs"
- Amino acid nodes that pulse with color
- Subtle glow effect emphasizing molecular structure
- Parallax movement based on scroll position
- Continuous slow rotation animation

**Visual Structure**:
```text
    ○───────○
     \     /
      ○───○
     /     \
    ○───────○
     \     /
      ○───○
     (rotating)
```

**Animation Details**:
- Continuous Y-axis rotation (10s per revolution)
- Individual nodes pulse in sequence
- Connecting bonds have subtle opacity animation
- Scroll-linked parallax for depth effect

---

## Integration Points

### Index.tsx Updates

Add new section for MoleculeBuilder:

```text
<Hero />
  → DNAHelix integrated as background element
<VialShowcase />
  → PurityDial added alongside ScientificMeters
<MoleculeBuilder /> ← NEW SECTION
<ProductCatalog />
...
```

### Hero.tsx Updates

- Add DNAHelix component as a decorative background element
- Position behind the main content with lower z-index
- Apply reduced opacity to prevent visual competition

### VialShowcase.tsx Updates

- Add PurityDial component next to or above the existing ScientificMeters
- Create a visual "laboratory dashboard" aesthetic

---

## Technical Implementation Details

### Shared Patterns

All animations will use:
- `framer-motion` for animations (already installed)
- `useInView` hook for scroll-triggered activation
- CSS variables for theming consistency
- Reduced motion media query support

### Color Palette

Using existing CSS variables:
- Primary (cyan): `hsl(var(--primary))`
- Success (green): `emerald-500`
- Warning (yellow): `amber-500`
- Danger (red): `rose-500`

### Performance Considerations

- SVG-based animations (GPU accelerated)
- `will-change` hints for transform animations
- `once: true` on `useInView` to prevent re-triggering
- Lazy rendering for off-screen components

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/components/MoleculeBuilder.tsx` | Create | Peptide chain assembly animation |
| `src/components/PurityDial.tsx` | Create | Circular gauge with sweeping needle |
| `src/components/DNAHelix.tsx` | Create | Rotating 3D helix background |
| `src/pages/Index.tsx` | Modify | Add MoleculeBuilder section |
| `src/components/Hero.tsx` | Modify | Integrate DNAHelix as background |
| `src/components/VialShowcase.tsx` | Modify | Add PurityDial to dashboard area |

---

## Accessibility

- All animations respect `prefers-reduced-motion`
- Decorative elements marked with `aria-hidden="true"`
- No essential information conveyed only through animation
- Sufficient color contrast maintained

