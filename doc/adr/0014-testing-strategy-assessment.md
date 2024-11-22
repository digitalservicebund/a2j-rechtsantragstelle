# ADR: Assessment of our Current Testing Strategy

## Status

Accepted

## Context

This ADR documents the current testing strategy and implementation in our codebase.
The goal is to provide a comprehensible overview of the status quo and identify areas for improvement.

### Test Types

#### Unit Tests

Unit tests are tests that verify the smallest, isolated pieces of code (such as functions or individual components) to ensure they work as expected independently from other parts of the system.
Unit tests are located in directories named `/__test__` within lowest-level app folders, close to the implementation.<br>
Examples:

- Domain logic tests:

  - Business logic (e.g. `/app/flows/beratungshilfeVorabcheck/__test__/freibetrag.test.ts` tests the calculation of a financial allowance or exemption amount).
  - Guards (e.g. `/app/flows/fluggastrechteVorabcheck/__test__/guards.test.ts` tests the correct behavior of the guards used in the Fluggastrechte Vorabcheck flow).
  - PDF generation (e.g. `/app/services/pdf/beratungshilfe/sections/__test__/A_angelegenheit.test.ts` ensure that the form fields and attachments of section A of the Beratungshilfe PDF are correctly filled with the provided data).

- Application logic tests:

  - React components (e.g. `/app/components/__test__/Button.test.tsx` validate the rendering and behavior of the 'Button' React component).
  - Utility functions (e.g. `/app/util/__test__/objects.test.ts` tests functions like `dropEachProperty`, `isKeyOfObject`, `objectMap`).

#### Integration Tests

Integration tests validate the interaction between different parts of the application.
Like unit tests, integration tests are located in directories named `/__test__` within the lowest-level app folders.<br>
Examples:

- Flow logic (e.g. `/app/flows/__test__/flows.test.ts` validate state machine flow logic using various test cases).

#### End-to-End Tests

End-to-end tests validate the application's functionality from the user's perspective. These tests are located in the `/tests/e2e` directory.<br>
Examples:

- Navigation for content pages (e.g. `/tests/e2e/pages/beratungshilfe.spec.ts` ensures the `/beratungshilfe` page is can be accessed and navigated).
- Interactive forms (e.g. `/tests/e2e/domains/beratungshilfe/vorabcheck/beratungshilfe.vorabcheck.spec.ts` tests the complete traversal of the Beratungshilfe Vorabcheck flow).
- Accessibility (e.g. `tests/e2e/pages/accessibilityScans.spec.ts` tests most of the content pages).
- Application security (e.g. `/tests/e2e/common/csrf.spec.ts`, which validates CSRF token behavior across multiple tabs).

### Test Coverage

#### Coverage Reports

Coverage is captured using `vitest` and therefore analyzed for all tests that are executed by that runner: unit and integration tests (not e2e tests which run with Playwright). Reports can be generated using `npm run test:coverage`. We use `istanbul` to generate coverage reports.

#### Coverage Gaps

- Not all possible paths through the different flows are covered by our `flows.test.ts` integration tests.
- We do not test different browser and device types with our e2e tests.
- We sparsely test failing form validations.
- Page accessibility is checked inconsistently across the e2e tests of the flows (missing "sub"-content-pages and missing flow pages).
- Application security is only tested to a very limited extent.
- We do not capture coverage for our e2e tests.
- Testing of the interaction between the app and the CMS has gaps.
- We do not test whether the user data reaches the PDF and is displayed correctly.

### Test Frameworks and Tools

#### Frameworks

- Vitest: Framework for unit and integration testing.
- Playwright: Framework for end-to-end testing.
- React Testing Library: Used for testing React components.
- axe-core: Accessibility testing engine.

#### Tools

- Lefthook: Used to enforce pre-commit `vitest` test runs (and type checking and linting).
- Faker: Used to generate test data.
- Fishery: Used to create test data factories.

### Test Organization

#### Directory Structure

See above under Test Types.

#### Colocation

Unit and integration tests are colocated with the implementation. End-to-end tests are located in the `/tests/e2e` directory.

### Test Quality

#### Maintainability

- `/app/flows/__test__/flows.test.ts` contains two parameterized tests for the state machine flows. Both tests run on all test groups defined as `testCases*` of the corresponding flows or subflows. The tests make use of the `nextStepId` function of the flow controller (`app/services/flow/server/buildFlowController.ts`) and transition through the corresponding flow by mocking user input and given events. The first test transitions through the flow from start to end using the `SUBMIT` event, while the second test transitions in the reverse direction using the `BACK` event. The test groups require to follow a defined structure:

```
{
  machine: FlowStateMachine,
  cases: [
    { FlowContext },
    string[]
    ]
}
```

Where `FlowContext` represents mocked user input of a specific flow state and `string[]` represents the expected steps that should be visited during the flow transition.
In case of a failing test in this suite, the test output only shows the context (mocked user input) and the visited steps.

### Continuous Integration

#### CI/CD Pipeline

`/.github/workflows/ci-pipeline.yml` is the main CI pipeline that triggers on pushes and pull requests to the main branch and can also be manually dispatched. Is perfoms automated test runs via 3 different actions:

1. Via the `code-quality` job (which is located in `npm-checks.yml`), `vitest run --coverage` which executes the `vitest` runner, including coverage reports. This job triggers all unit, integration and components tests.
2. In the `verify-local-e2e`job (described in `e2e-test.yml`), `npx playwright test` is executed to run the end-to-end tests against a locally built and served instance of the application (using the content that was last deployed successfully!), where 'local' refers to the CI respectively the pipeline environment.
3. The `verify-preview-e2e` job (also in `e2e-test.yml`) runs the end-to-end tests against a preview deployment of the application. This job is triggered after a successful deployment to the preview environment.

The end-to-end tests in the CI pipeline run in sharded mode, meaning that the tests are split into multiple shards to speed up the test execution. At the time of writing, the slowest shard (we currently use 4 shards) of each test run (`verify-local-e2e` and `verify-preview-e2e`) in the CI pipeline takes about 6 to 8 minutes to finish.

#### Automated Testing Pre Commit

Lefthook is used also to enforce pre-commit `vitest` test runs. Failing unit, integration or component tests will prevent the commit from being created.

### Test Data Management

#### Fixtures

Fixtures are known data sets used in tests to ensure consistent test results.
Fixtures for some of the flows are located in `/tests/e2e/fixtures`, all with a variable name `happyPathData`. Some of the fixtures represent a comprehensive possible state of a corresponding flow from start to end while others only represent a partial state.
They are used in several unit and integration tests. Some of the fixtures use `faker` to generate random data, while others are hardcoded.

#### Factories

Factories generate dynamic test data which is generated on demand.
Factories are located in the `/tests/e2e/factories` directory. Most of them mock Strapi objects and are used in `/app/services/cms/__test__`. There are also factories for mocking objects of the `pdfkit` library. Some of the factoriy function follow a naming convention like `<reponsibility>Factory` (e.g. `strapiParagraphFactory`), whereas others don't.

## Decision

The current testing strategy is documented as described above. This ADR serves as a baseline for analyzing and improving our testing strategy.

## Consequences

### We want to:

#### Unit tests

- Intentionalize accessibility tests (e.g add accessibility tests for individual React components).

#### Integration tests

- Cover all possible paths of each flow with our `/app/flows/__test__/flows.test.ts` integration tests.
- Improve log output of failing tests in `/app/flows/__test__/flows.test.ts`.
- Improve test coverage between app and cms interface (e.g. test if all pages are available in the CMS, test if field names from strapi match app schema).
- Add tests for failing form validations.

#### End-to-End tests

- Only test the shortest path (including pdf download) of each flow in the e2e tests.
- Add other device types and browsers in our e2e tests.
- Add tests for PDF generation and display.

#### General

- Change pre-commit vitest test runs to pre-push.
- Replace or remove fishery package, since it has not been updated for 3 years.
- Expand our security e2e-tests, like checking security headers.
