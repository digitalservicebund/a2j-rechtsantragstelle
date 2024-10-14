# ADR: Assesment of our Current Testing Strategy

## Status

Accepted

## Context

This ADR documents the current testing strategy and implementation in our codebase.
The goal is to provide a comprehensible overview of the status quo and identify areas for improvement.

## Current Testing Strategy

### Test Types

- **Unit Tests**:
  Unit tests are tests that verify the smallest, isolated pieces of code (such as functions or individual components) to ensure they work as expected independently from other parts of the system.
  Unit tests are located in directories named `/__test__` within lowest-level app folders, close to the implementation.
  These tests typically include:

  - Utility functions: For example, in `/app/util/__test__/objects.test.ts`, unit tests check functions like `isKeyOfObject`, `objectMap`, and `dropEachProperty`.
  - React component tests located in `/app/components/__test__`. These tests validate the rendering and behavior of React components. E.g. `/app/components/beratungshilfe/__test__/BeratungshilfeForm.test.tsx` tests the rendering and behavior of the Beratungshilfe form component.

- **Integration Tests**:
  Integration tests validate the interaction between different parts of the application.
  As like unit tests, integration tests are also located in directories named `/__test__` within the lowest-level app folders.
  Examples include:

  - Flow logic: Such as in `/app/flows/__test__/flows.test.ts`, where the tests validate state machine flow logic using various test cases.
  - Form handling and calculation logic: For instance, tests in `/app/flows/beratungshilfeVorabcheck/__test__/freibetrag.test.ts` validate the correctness of income calculations and related logic.
  - PDF generation: Located in `/app/services/pdf/beratungshilfe/sections/__test__/A_angelegenheit.test.ts`, these tests ensure that PDF generation logic works correctly with the provided data.

- **End-to-End Tests**:
  E2E tests validate the application's functionality from the user's perspective using Playwright. These tests are located in the tests/e2e directory and include:

  - Page accessibility and navigation for content pages: Example in `/tests/e2e/pages/beratungshilfe.spec.ts` which ensures the `/beratungshilfe` page is accessible.
  - State machine transitions: For example, `/tests/e2e/flowPages/beratungshilfe/vorabcheck/beratungshilfe.vorabcheck.spec.ts` tests the complete traversal of the Beratungshilfe Vorabcheck flow. Page accessibility is checked inconsistently across the e2e tests of the flows.
  - CSRF protection: Such as `/tests/e2e/common/csrf.spec.ts`, which validates CSRF token behavior across multiple tabs.

### Test Coverage

- **Coverage Reports**: Coverage is captured using `vitest` and therefore analyzed for all tests that are executed by that runner: unit and integration tests (not e2e tests which run with Playwright). Reports can be generated using `npm run test:coverage`. We use `istanbul` to generate coverage reports.
- **Coverage Gaps**: tbd

### Test Frameworks and Tools

- **Frameworks**:
  - Vitest: Framework for unit and integration testing (replacing Jest as per [ADR0007](0007-vitest-test-runner.md))
  - Playwright: Framework for end-to-end testing.
  - React Testing Library: Used for testing React components.
- **Tools**:
  - Lefthook: Used to enforce pre-commit `vitest` test runs (and type checking and linting).
  - Faker: Used to generate test data.
  - Fishery: Used to create test data factories.

### Test Organization

- **Directory Structure**: See above under Test Types.
- **Colocation**: Unit and integration tests are colocated with the implementation. End-to-end tests are located in the `/tests/e2e` directory.

### Test Quality

- **Best Practices**: tbd
- **Maintainability**:

  - `/app/flows/__test__/flows.test.ts` contains two parameterized tests for the state machine flows. Both tests run on all test groups defined as `testCases*` of the corresponding flows or subflows. The tests make use of the `nextStepId` function of the flow controller (`app/services/flow/server/buildFlowController.ts`) and transition through the corresponding flow by mocking user input and given events. The first test transitions through the flow from start to end using the `SUBMIT` event, while the second test transitions in the reverse direction using the `BACK` event. The test groups require to follow a defined structure:

  ```
  tbd
  ```

  In case of a failing test in this suite, the test output is not very helpful in identifying the root cause of the failure. The test output only show the context (mocked user input) and the visited steps.

- **Readability**: tbd
  - Test naming conventions: tbd

### Continuous Integration

- **CI/CD Pipeline**:
  `/.github/workflows/ci-pipeline.yml` is the main CI pipeline that triggers on pushes and pull requests to the main branch and can also be manually dispatched. Is perfoms automated test runs via 3 different actions:

1. Via the `code-quality` job (which is located in `npm-checks.yml`), `vitest run --coverage` which executes the `vitest` runner, including coverage reports. This job triggers all unit, integration and components tests. In `.eslintrc.cjs` is defined which files are included in `vitest`'s test run.
2. In the `verify-local-e2e`job (described in `e2e-test.yml`), `npx playwright test` is executed to run the end-to-end tests against a locally built and served instance of the application, where 'local' refers to the CI respectively the pipeline environment.
3. The `verify-preview-e2e` job (also in `e2e-test.yml`) runs the end-to-end tests against a preview deployment of the application. This job is triggered after the a new preview deployment is created.

The end-to-end tests in in CI pipeline run in sharded mode, meaning that the tests are split into multiple shards to speed up the test execution.

- **Automated Testing Pre Commit**:
  Lefthook is used also to enforce pre-commit `vitest` test runs. Failing unit, integration or component tests will prevent the commit from being created.

### Test Data Management

- **Fixtures**:
  Fixtures are known data sets used in tests to ensure consistent test results.
  Fixtures for some of the flows are located in `/tests/e2e/fixtures`, all with a variable name `happyPathData`. Some of the fixtures represent a comprehensive possible state of a corresponding flow from start to end while others only represent a partial state.
  They are used in several unit and integration tests. Some of the fixtures use `faker` to generate random data, while others are hardcoded.
- **Factories**:
  Factories generate dynamic test data which is generated on demand.
  Factories are located in the `/tests/e2e/factories` directory. Most of them mock Strapi objects and are used in `/app/services/cms/__test__`. There are also factories for mocking objects of the `pdfkit` library. Some of the factoriy function follow a naming convention like `<reponsibility>Factory` (e.g. `strapiParagraphFactory`), whereas others don't.
- **Mocks and Stubs**: tbd

## Decision

The current testing strategy is documented as described above. This ADR serves as a baseline for analyzing and improving our testing strategy.

## Consequences

- **Positive**: Provides a clear understanding of the current testing strategy.
- **Negative**: May reveal gaps and areas for improvement in the testing strategy (this might also be considered a positive consequence).

## Next Steps

- Analyze the documented testing strategy.
- Identify areas for improvement.
- Propose suggestions and advice on how to enhance the testing strategy.
