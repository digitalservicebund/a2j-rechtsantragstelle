# 9. Recording Fail Videos from E2E Tests

Date: 2024-08-19

## Status

Agreed

## Context

In our previous setup, we recorded videos of failing end-to-end (E2E) tests using the `retain-on-failure` option in the Playwright configuration. This feature allowed us to review the circumstances surrounding test failures, facilitating easier identification of potential root causes. However, as described in the [playwright documentation](https://playwright.dev/docs/videos), this option records videos for every test and deletes those from successful runs. As a result, it extended the execution time of our E2E tests within the GitHub Actions pipeline, ultimately slowing down our production deployment process.

## Decision

We have opted to implement the `on-first-retry` option. This adjustment allows us to record videos only when a test fails for the first time, thereby maintaining valuable insights without compromising efficiency.

## Consequences

- Videos will now only be recorded for the first failure in a retry, enhancing the speed of the E2E test process.
- Deployment times to production will be significantly reduced.
