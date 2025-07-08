# Unified Grid System Implementation

## Status

**Proposed** - 8th of July 2025

## Context

The application currently uses conditional `alignToMainContainer` logic to determine whether header and breadcrumb content should align with the main container. This approach creates several issues:

### Current Problems

- **Inconsistent spacing** between Header, Main content, and Footer sections
- **Complex conditional logic** based on URL patterns (`!flowIdFromPathname(pathname)?.match(/formular|antrag/)`)
- **Maintenance overhead** with multiple alignment strategies
- **Poor visual hierarchy** due to misaligned content sections
- **TypeScript complexity** with conditional props and interfaces

### Current Architecture

```
┌─────────────────────────────────────┐
│           Header (conditional)      │
├─────────────────────────────────────┤
│         Breadcrumbs (conditional)   │
├─────────────────────────────────────┤
│                                     │
│         Main Content (fixed)        │
│    ┌─────────┐ ┌─────────┐         │
│    │ Column1 │ │ Column2 │         │
│    └─────────┘ └─────────┘         │
│                                     │
├─────────────────────────────────────┤
│           Footer (full-width)       │
└─────────────────────────────────────┘
```

## Decision

We will implement a **unified grid system** that removes the `alignToMainContainer` logic and ensures consistent content alignment across all page sections.

### Chosen Approach

- Create a reusable `GridContainer` component
- Apply consistent grid constraints to Header, Main content, and Footer
- Remove all conditional alignment logic
- Maintain responsive behavior across all sections

### Target Architecture

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────────┐ │
│  │         Header Content          │ │  ← Same grid container
│  └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐ │
│  │         Breadcrumbs             │ │  ← Same grid container
│  └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐ │
│  │         Main Content            │ │  ← Same grid container
│  │    ┌─────────┐ ┌─────────┐     │ │
│  │    │ Column1 │ │ Column2 │     │ │
│  │    └─────────┘ └─────────┘     │ │
│  └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐ │
│  │         Footer Content          │ │  ← Same grid container
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Consequences

### Positive Consequences

#### Code Quality

- **Simplified logic** - No more conditional alignment
- **Reduced complexity** - Fewer props and conditionals
- **Better maintainability** - Single source of truth for grid constraints
- **Type safety** - Cleaner TypeScript interfaces
- **Reduced bundle size** - Less conditional logic

#### User Experience

- **Consistent spacing** - All content aligns perfectly
- **Better visual hierarchy** - Unified layout structure
- **Responsive consistency** - All sections behave the same way
- **Improved accessibility** - Consistent navigation patterns

#### Performance

- **Easier optimization** - Unified grid system
- **Reduced re-renders** - Simplified component logic

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
- [ ] Performance testing

## Technical Specifications

### GridContainer Component

```typescript
interface GridContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}
```

### Default Configuration

- **Max-width**: 1200px (needs to be decided by design)
- **Padding**: Responsive (needs to be decided by design)
- **Grid columns**: 1 column by default, configurable for main content
- **Centered**: Always center the container

### Files to Modify

- `app/root.tsx` - Remove conditional logic in loader
- `app/components/PageHeader.tsx` - Remove alignToMainContainer prop
- `app/components/Breadcrumbs.tsx` - Remove alignToMainContainer prop
- `app/components/Footer.tsx` - Wrap in GridContainer
- `app/components/GridContainer.tsx` - New component

## Alternatives Considered

### Alternative 1: Keep Current System

- **Pros**: No migration effort, no breaking changes
- **Cons**: Continued maintenance overhead, inconsistent UX
- **Decision**: Rejected due to long-term maintenance costs

### Alternative 2: CSS Grid Only

- **Pros**: Simpler implementation, no new components
- **Cons**: Less flexible, harder to maintain responsive behavior
- **Decision**: Rejected due to flexibility requirements and future proofing

### Alternative 3: Container Queries

- **Pros**: Modern CSS approach, component-based responsive design
- **Cons**: Limited browser support, complex implementation
- **Decision**: Rejected due to browser compatibility requirements

## Risk Assessment

### High Risk

- **Layout breaking changes** - Could affect user experience
- **Form functionality** - Critical for application core features

### Medium Risk

- **Responsive behavior** - Need thorough testing across devices
- **Performance impact** - New component overhead

### Low Risk

- **Accessibility** - Should improve with consistent layout
- **Code maintainability** - Will improve significantly

## Success Metrics

### Technical Metrics

- [ ] Zero layout regressions across all page types
- [ ] Improved Lighthouse performance scores
- [ ] Reduced bundle size by removing conditional logic - hopefully
- [ ] 100% test coverage for GridContainer component

### User Experience Metrics

- [ ] Consistent visual alignment across all pages
- [ ] Improved responsive behavior scores
- [ ] No accessibility regressions
