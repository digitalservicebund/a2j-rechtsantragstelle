# Erbschein Wegweiser PoC

This note describes the current PoC state. It replaces the older `arrayField` write-up, which no longer matches the implementation.

## Goal

Model the Figma-style `Variante geschlossen` flow for the Erbschein Wegweiser with as little architectural spillover as possible.

Core pattern:

- ask whether a relative group exists
- ask for the count
- render all items on one page
- show a compact overview page

## What the PoC does

- uses clean nested data shapes without `#` field names
- models spouse, children, parents, and siblings in `pages.ts`
- supports count-based multi-entry pages for top-level children and siblings
- shows a simple overview for those entered top-level relatives
- keeps the flow in the shared vorabcheck route instead of introducing Erbschein-only routes
- treats intermediate “Erbschein erforderlich ...” info screens as normal vorabcheck pages; only true dead ends stay in the result route

## What is only modeled, not fully rendered

The nested family tree is present in schemas and tests, but not yet as a full end-user UI flow.

- grandchildren
- nieces / nephews
- great-nieces / great-nephews

In other words: the data model reaches further than the current CMS/UI content.

## Why there is custom PoC code

Two small PoC-specific additions remain justified:

- `form-elements.multi-item-input`
  Reason: the existing renderer has no built-in way to render `N` repeated groups on one page from a count field.
- local vorabcheck summary rendering
  Reason: the existing formular `ArraySummary` flow assumes add-item events, per-item edit URLs, and array configuration metadata that vorabcheck does not have.

## Changes that are part of the diff but not really part of the PoC

- generic `arraySchema` support in shared page-schema handling
  Reason: the no-`#` data model needed shared schema/path support.
- temporary result-page fallback logic was tried during development, but the cleaner final direction is to keep transitional info pages out of the result route
