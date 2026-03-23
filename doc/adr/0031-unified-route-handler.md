# ADR: Unified route handler

## Status

- 2026-03-23: Drafted
- 2026-03-XX: Accepted

## Context

We currently have 3 separate page types, `VorabcheckPage`, `FormularPage`, `ResultPage`. This separation cuts through the whole stack, from Strapi to our app, and there from loader to actions to frontend component. The differences to the user (content editors and service users) however are only visual:

- Progress bar (vorabcheck)
- Side-menu navigation (formular)
- Stepper (formular with extra config)
- Colorbox at the top (resultpage)

This separation creates confusion, discrepancies in features (like arrays not available in vorabchecks), overhead in development & testing etc.

## Decision

Both loader and action should be unified across all three page types. This ensures feature and behavioral parity. The `flowType` configuration (`vorabcheck` vs `formular`) should be used for CMS lookup (because for now they will still live in different collections) and to “configure” the front-end components (vorabcheck: show progress bar, …).

To free us from current constraints, we re-write this universal loader from scratch, re-using or re-writing existing services where needed. This will facilitate shared understanding of data flow, modularity and enabling upcoming refactorings without legacy code constraints.

### Goals

- Clear separation of concerns
  - Loader & Action: HTTP layer (routing, cookies)
  - SessionStore: retrieving & storing user Data
  - FlowController: interacting with the flow
  - Component
- Do meaningful work once
  - parsing
  - creating state machines
  - string templating
  - ...
- Pass minimal data down / up the call chain

##
