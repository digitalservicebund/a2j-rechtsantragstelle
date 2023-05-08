# A2J - Digitale Rechtsantragstelle

First draft of implementing a platform to create requests to the Rechtsantragstelle.

## Development

### Requirements

- Node.js >= 16.0.0
- npm 7 or greater
- A [strapi instance](https://github.com/digitalservicebund/a2j-rechtsantragstelle-strapi) and a configured .env file (see .env.example)

### Run Server in Development Mode

```sh
npm install
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.
Open the app in `localhost:3000`

### Run tests

#### unit

```sh
npm test
```

#### e2e

```sh
npx playwright test
```

##### run tests

- run only one test: `test.only`
- run only tests in one describe block: `test.describe.only`
- run only one spec file: `npx playwright test homepage.spec.ts`
- go through a test step by step: `npx playwright test --debug` -> F10 to step over

##### write tests

- [getting started](https://playwright.dev/docs/writing-tests) writing tests
- use [codegen](https://playwright.dev/docs/codegen-intro) as an aid: `npx playwright codegen localhost:3000/kitchensink`

##### debug tests in CI

1. download `playwright-report.zip` artifact from GitHub action summary page (only present on e2e failure for 30 days)
2. unzip
3. `npx playwright show-trace <DOWNLOAD_PATH>/data/<HASH>.zip`
