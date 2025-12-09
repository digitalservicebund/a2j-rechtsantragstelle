# 30. E2E Test Strategy for Flow services

## Status

- 2025-12-05: Drafted

## Context

For every Flow service, we have added E2E tests to cover the following scenarios:

- Verify that Strapi contains the corresponding page with the correct form elements.
- Validate integration between the WebService application (React Router), Strapi (CMS), and Redis.
- Verify that all form components (inputs, radios, etc.) behave as expected.
- Validate a basic happy-path scenario for each Flow service, including its business logic.

Currently, E2E tests for Flow domains are the slowest in our project and often provide limited value. Many tests repeatedly validate the same low-level behaviors (e.g., typing into inputs or selecting radio options). Some edge cases are also difficult to test via E2E because reaching specific states requires traversing Flow business logic that may change at any time. With additional Flow services planned, expanding the current E2E approach will continue to increase test duration without proportional benefit.

Since the implementation of [Page Schemas](/doc/adr/0022-pageConfig-inside-application.md), form configuration no longer depends on Strapi, and we no longer expect Strapi to contain fully configured form elements for Flow pages (Formular and Vorabcheck).

Also, all the Flow services share the same generic functions for loading and saving page data, as well as an unified routing configuration, with business logic defined in the domain folder as described in [ADR 0012](/doc/adr/0022-pageConfig-inside-application.md). This allows multiple services (e.g., Beratungshilfe and Fluggastrechte) to reuse the same core source code.

In addition to E2E tests, we already maintain:

- Flow business logic tests — Verify navigation rules (e.g., given specific user data, the user is directed from page A to B).
- Component tests — Validate component behavior under specific conditions, such as error states or accessibility requirements.
- Unit tests — Test generic functions such as loaders and actions for Formular routes.

Although these tests provide strong coverage, we still need E2E tests to ensure integration between Redis, Strapi, and the WebService application. However, we do not need to test every flow scenario, as this results in repetitive and slow tests.

## Proposal

Remove all existing Flow-domain E2E tests and replace them with a single, generic `fake Flow` E2E test suite. This fake Flow service should:

- Include all currently used form components (Input, Radio, AutoSuggestionInput, etc.) across multiple test pages.
- Follow a specification defined by the A2J engineering team.
- Exercise the FlowNavigation component, validating navigation behavior and state handling.
- Include edge-case coverage, such as:
  - Saving data to S3.
  - Generating PDFs.
  - Multi-field validation scenarios.
  - Verifying that string replacements are correctly applied.
  - Verifying Array pages scenarios.

## Consequences

### Pros:

- Significant reduction in E2E test runtime, even as new Flow services are added.
- More focused and valuable test coverage, ensuring component behavior and critical integration paths work correctly.
- Removal of business-logic-specific E2E tests, keeping business logic testing isolated in its dedicated test suite.

### Cons:

- Loss of accessibility checks on real Flow service pages that contain large amounts of content.
- Potential need for a new script to verify that required Flow pages exist in Strapi, since page existence is still mandatory.
- We need to restrict access the `fake Flow` in production as this service it is only required for test purposes.

## Future consideration

We can re-enable the E2E tests for the `Flow services` after deployment to the production environment to ensure the services are running as expected. However, this will require ongoing maintenance from a `QA engineer`, as these tests may fail whenever changes are made to the Flow services or their components.
