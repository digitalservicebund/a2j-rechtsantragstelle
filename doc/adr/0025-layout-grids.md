# Unified Grid System Implementation

## Status

- 2025-08-20: Drafted & Accepted
- 2025-08-25: Edited (updated chronological status)

## Context

The application right now rely on css flexbox to position components this approach creates several issues:

### Current Problems

- **Inconsistent spacing** between Header, Main content, and Footer sections
- **Maintenance overhead** with multiple alignment strategies
- **Poor visual hierarchy** due to misaligned content sections

### Current Architecture

```
┌─────────────────────────────────────┐
│         Header (conditional)        │
├─────────────────────────────────────┤
│         Breadcrumbs (conditional)   │
├─────────────────────────────────────┤
│                                     │
│         Main Content (fixed)        │
│                                     │
├─────────────────────────────────────┤
│         Footer (full-width)         │
└─────────────────────────────────────┘
```

## Decision

We will implement a **unified grid system**. Use css grid instead of flexbox inspired by KERN for easy immigration later. Based on responsive design definition provided by design

## Responsive design definition

- S (320px) = Mobile (portrait + landscape)
- M (<768px) = Tablet (portrait)
- L (<1024px) = Tablet (landscape) + Desktop (narrow)
- XL (<1248px) = Desktop (wide)

### Chosen Approach

- Create a reusable `GridContainer` component
- Apply consistent grid constraints to Header, Main content, and Footer
- Remove all conditional alignment logic
- Use css grids instead of flexbox for the layout
- Maintain responsive behavior across all sections

### Target Architecture

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────────┐│
│  │         Header Content          ││  ← Same grid container
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │         Breadcrumbs             ││  ← Same grid container
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │         Main Content            ││  ← Same grid container
│  │    ┌─────────┐ ┌─────────┐      ││
│  │    │ Column1 │ │ Column2 │      ││
│  │    └─────────┘ └─────────┘      ││
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │         Footer Content          ││  ← Same grid container
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

## Consequences

### Positive Consequences

#### Code Quality

- **Simplified logic** - No more conditional alignment
- **Reduced complexity** - Fewer props and conditionals
- **Better maintainability** - Single source of truth for grid constraints

#### User Experience

- **Consistent spacing** - All content aligns perfectly
- **Better visual hierarchy** - Unified layout structure
- **Responsive consistency** - All sections behave the same way

### Negative Consequences

#### Migration Effort

- **Breaking changes** - Removal of `alignToMainContainer` prop
- **Component updates** - Need to update PageHeader, Breadcrumbs, Footer
- **Testing overhead** - Comprehensive testing across all page types
- **Deployment risk** - Changes affect layout across entire application

#### Potential Issues

- **Content overflow** - Some content might not fit new grid constraints
- **Responsive edge cases** - Need to test all breakpoints thoroughly
- **Form compatibility** - Ensure form pages still work correctly

## Implementation Plan

### Phase 1: Foundation

- [ ] Create `GridContainer` component
- [ ] Add TypeScript interfaces
- [ ] Create unit tests for GridContainer

### Phase 2: Remove Legacy Logic

- [ ] Remove `alignToMainContainer` from root loader
- [ ] Remove prop from PageHeader component
- [ ] Remove prop from Breadcrumbs component
- [ ] Update TypeScript interfaces
- [ ] Update component tests

### Phase 3: Update Layout Components

- [ ] Wrap PageHeader content in GridContainer
- [ ] Wrap Breadcrumbs content in GridContainer
- [ ] Wrap Footer content in GridContainer
- [ ] Wrap main content in GridContainer
- [ ] Test responsive behavior

### Phase 4: Testing & Refinement

- [ ] Test responsive behavior across all screen sizes
- [ ] Verify consistent spacing between sections
- [ ] Test with different content types (forms, content pages, etc.)
- [ ] Ensure accessibility is maintained

## Technical Specifications

### GridContainer Component

```typescript
interface GridContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "xxl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}
```

### Default Configuration

- **Max-width**: 1280px (decided by design)
- **Padding**: 16px left and 16px right, with a 32px gap between columns
- **Grid columns**: 12 columns for XL and L screen sizes, 8 for M and 1 for S
- **Centered**: Always center the container
