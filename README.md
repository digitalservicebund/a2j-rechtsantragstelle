# A2J / Access to Justice / Zugang zu Recht

This repository runs https://service.justiz.de/. We provide user-centered access to digital justice services. To find out more, check our [project homepage](https://www.zugang-zum-recht-projekte.de/)

## Requirements

- Node (>= 22) + npm
- Docker (Redis, S3 bucket)

### Local development

```sh
npm install
docker compose up -d
npm run dev
```

The app will be served on http://localhost:3000, assets are rebuilt on file save.

To explore the codebase, you can use this [interactive code map](https://mango-dune-07a8b7110.1.azurestaticapps.net/?repo=digitalservicebund%2Fa2j-rechtsantragstelle).

### Content

There are several options for fetching content: Local CMS, staging CMS, local content file. To find out more, check `/doc/content.md`.

### Tests

#### Unit tests

- run: `npm run test`
- run in [watch mode](https://vitest.dev/guide/features.html#watch-mode): `npm run test:watch`
- run with coverage: `npm run test:coverage`
- run subset: `npm run test "STRING_TO_MATCH"`

#### E2E tests

- run: `npm run test:e2e`
- UI: `npm run test:e2e:ui`

For more details, check `/doc/e2e-tests.md`

### Git Hooks

We use [lefthook](https://github.com/evilmartians/lefthook) for running several pre-commit hooks, install them using `npm run init`.

The git hooks check formatting, linting, unit tests, typecheck. You may execute them before committing using `lefthook run pre-commit`. See `lefthook.yaml` for more details.

### Storybook

Storybook containing our components is running on staging and [preview](https://a2j-test.dev.ds4g.net/storybook/). To run it locally, use `npm run start:storybook`.

## Known issues

When running S3 LocalStack alongside an AVM FritzBox, you might encounter issues accessing LocalStack due to DNS rebind protection. For more details, you can check [this guide](https://docs.localstack.cloud/user-guide/tools/dns-server/#:~:text=Route53%20documentation.-,DNS%20rebind%20protection,-If%20you%20rely) and [this discussion](https://discuss.localstack.cloud/t/localstack-cloud-never-resolves-in-browser-ping/924).

To resolve this, you need to allow `localhost.localstack.cloud` in your FritzBox's DNS Rebind Protection settings. You can find step-by-step instructions [here](https://avm.de/service/wissensdatenbank/dok/FRITZ-Box-7590/3565_FRITZ-Box-meldet-Der-DNS-Rebind-Schutz-hat-Ihre-Anfrage-aus-Sicherheitsgrunden-abgewiesen/), and be sure to select your router model.

## Code Language Conventions

This project uses a hybrid approach to language in code, mixing English and German.
While technical implementation uses English (e.g., `function validateData()`), domain-specific terms can be kept in German (e.g., `hasRechtsschutzversicherung: boolean`).
This is crucial because many German administrative terms lack precise English equivalents, leading to inconsistencies and communication overhead when translated.
This hybrid approach ensures clear communication with domain experts and maintains code readability within our specific context.
While we acknowledge this might pose a barrier for non-German speaking contributors, we believe it's the most effective solution for our project.
We encourage contributors to ask questions about any unfamiliar German terms.

## Contributing

[Deutsche sprache weiter unten](#mitwirken)

Everyone is welcome to contribute! You can contribute by giving feedback, adding issues, answering questions, providing documentation or opening pull requests. Please always follow the guidelines and our [Code of Conduct](CODE_OF_CONDUCT.md).

To contribute code, simply open a pull request with your changes and it will be reviewed by someone from the team. By submitting a pull request you declare that you have the right to license your contribution to the DigitalService and the community under the [MIT License](./LICENSE).

## Mitwirken

Jede:r ist herzlich eingeladen, die Entwicklung der _Project_ mitzugestalten. Du kannst einen Beitrag leisten, indem du Feedback gibst, Probleme beschreibst, Fragen beantwortest, die Dokumentation erweiterst, oder Pull-Requests eröffnest. Bitte befolge immer die Richtlinien und unseren [Verhaltenskodex](CODE_OF_CONDUCT.md).

Um Code beizutragen erstelle einfach einen Pull Requests mit deinen Änderungen, dieser wird dann von einer Person aus dem Team überprüft. Durch das Eröffnen eines Pull-Request erklärst du ausdrücklich, dass du das Recht hast deine Beitrag an den DigitalService und die Community unter der [MIT License](./LICENSE) zu lizenzieren.
