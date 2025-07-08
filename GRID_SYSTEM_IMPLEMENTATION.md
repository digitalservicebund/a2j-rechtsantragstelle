# Grid System Implementation Guide

## Overview

This document outlines the implementation of a unified grid system across all pages, removing the `alignToMainContainer` logic and ensuring consistent content alignment between Header, Main content, and Footer sections.

## Current State

The application currently uses conditional `alignToMainContainer` logic to determine whether header and breadcrumb content should align with the main container. This creates inconsistent spacing and adds unnecessary complexity.

## Target State

A unified grid system where:

- Header, Main content, and Footer all use the same grid container
- Consistent max-width and padding across all sections
- Simplified component logic without conditional alignment
- Responsive behavior that works uniformly across all sections

## Implementation Strategy

### 1. Create Grid Container Component

**File:** `app/components/GridContainer.tsx`

Create a reusable `GridContainer` component that provides:

- Consistent max-width (matching current main container)
- Responsive padding/margins
- Optional grid columns for main content
- Same breakpoints across all sections

**Features:**

- `maxWidth` prop for different container sizes
- `padding` prop for different spacing needs
- `columns` prop for grid layouts in main content
- Responsive breakpoints (mobile, tablet, desktop)

### 2. Remove alignToMainContainer Logic

**Files to update:**

- `app/root.tsx` - Remove conditional logic in loader
- `app/components/PageHeader.tsx` - Remove alignToMainContainer prop
- `app/components/Breadcrumbs.tsx` - Remove alignToMainContainer prop

**Changes:**

- Remove `alignToMainContainer` from loader return data
- Remove conditional logic: `!flowIdFromPathname(pathname)?.match(/formular|antrag/)`
- Remove prop from PageHeader and Breadcrumbs components
- Clean up any related TypeScript interfaces

### 3. Update Layout Components

**PageHeader Component:**

- Wrap header content in `GridContainer`
- Remove `alignToMainContainer` prop and related logic
- Maintain existing responsive behavior

**Breadcrumbs Component:**

- Wrap breadcrumb content in `GridContainer`
- Remove `alignToMainContainer` prop and related logic
- Ensure proper spacing with header

**Footer Component:**

- Wrap footer content in `GridContainer`
- Maintain existing responsive behavior
- Ensure consistent spacing with main content

**Main Content Area:**

- Wrap `<Outlet />` in `GridContainer`
- Add grid column support for multi-column layouts
- Maintain existing responsive behavior

### 4. Update Root Layout

**File:** `app/root.tsx`

**Changes:**

```tsx
// Remove from loader
alignToMainContainer: !flowIdFromPathname(pathname)?.match(/formular|antrag/),

// Update JSX structure
<PageHeader {...pageHeaderProps} /> // Remove alignToMainContainer prop
<Breadcrumbs breadcrumbs={breadcrumbs} /> // Remove alignToMainContainer prop
<main className="flex-grow flex" id="main">
  <GridContainer>
    <Outlet />
  </GridContainer>
</main>
```

### 5. Grid Container Specifications

**Default Configuration:**

- Max-width: Match current main container (likely 1200px or similar)
- Padding: Responsive padding (16px mobile, 24px tablet, 32px desktop)
- Grid columns: 1 column by default, configurable for main content
- Centered: Always center the container

**Props Interface:**

```tsx
interface GridContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}
```

## Implementation Steps

### Phase 1: Foundation

1. Create `GridContainer` component
2. Add TypeScript interfaces
3. Create unit tests for GridContainer

### Phase 2: Remove Legacy Logic

1. Remove `alignToMainContainer` from root loader
2. Remove prop from PageHeader component
3. Remove prop from Breadcrumbs component
4. Update TypeScript interfaces

### Phase 3: Update Layout Components

1. Wrap PageHeader content in GridContainer
2. Wrap Breadcrumbs content in GridContainer
3. Wrap Footer content in GridContainer
4. Wrap main content in GridContainer

### Phase 4: Testing & Refinement

1. Test responsive behavior across all screen sizes
2. Verify consistent spacing between sections
3. Test with different content types (forms, content pages, etc.)
4. Ensure accessibility is maintained

## Benefits

### Code Quality

- **Simplified logic** - No more conditional alignment
- **Reduced complexity** - Fewer props and conditionals
- **Better maintainability** - Single source of truth for grid constraints
- **Type safety** - Cleaner TypeScript interfaces

### User Experience

- **Consistent spacing** - All content aligns perfectly
- **Better visual hierarchy** - Unified layout structure
- **Responsive consistency** - All sections behave the same way
- **Improved accessibility** - Consistent navigation patterns

### Performance

- **Reduced bundle size** - Less conditional logic
- **Better caching** - More predictable component rendering
- **Easier optimization** - Unified grid system

## Migration Considerations

### Backward Compatibility

- Ensure existing pages continue to work
- Maintain current responsive behavior
- Preserve accessibility features

### Testing Strategy

- Test all existing page types
- Verify responsive behavior on all breakpoints
- Test with different content lengths
- Ensure form pages still work correctly

### Rollout Plan

1. Implement in development environment
2. Test thoroughly with existing content
3. Deploy to staging for QA
4. Gradual rollout to production

## Future Enhancements

### Grid System Extensions

- Support for asymmetric grids
- Advanced responsive breakpoints
- Grid gap customization
- Nested grid support

### Component Integration

- Integration with existing form components
- Support for dynamic content areas
- Enhanced responsive utilities

## Conclusion

This unified grid system approach will significantly improve the codebase's maintainability while providing a more consistent user experience. The removal of `alignToMainContainer` logic simplifies the component architecture and creates a more predictable layout system.
