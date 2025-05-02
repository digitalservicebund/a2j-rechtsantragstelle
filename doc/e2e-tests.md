- debug (F10 to step over): `npx playwright test --debug`

> **Note**
>
> Remember to install playwright cli and set the environment variable GERICHTSFINDER_ENCRYPTION_KEY.

#### Write E2E tests

- [getting started](https://playwright.dev/docs/writing-tests) writing tests
- use [codegen](https://playwright.dev/docs/codegen-intro) as an aid: `npx playwright codegen localhost:3000/kitchensink`

#### Debug E2E tests in CI

1. download `playwright-report.zip` artifact from GitHub action summary page (only present on e2e failure for 30 days)
2. unzip
3. `npx playwright show-trace <DOWNLOAD_PATH>/data/<HASH>.zip`
