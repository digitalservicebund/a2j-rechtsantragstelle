# 28. Disable lazy route discovery in React Router

## Status

- 2025-11-11: Drafted
- 2025-11-13: Edited & Accepted

## Context

We discovered a bug in our app:

When a user is on a page (e.g., /beratungshilfe/antrag/rechtsproblem/situation-beschreibung) and fills out the form fields (textareas) and f a new build is deployed between first visit of the page and data submission, a hard refresh is triggered, causing a loss of all previously entered data..

After the hard refresh, textarea content is lost, and no input is submitted to Redis.

Root cause: During the deployment process, a new manifest file is generated, replacing the previous one and resulting in a version mismatch. React Router internally fetches `[baseURL]/__manifest?paths=[path]&version=[hash]`. The request returns 204 (No Content), triggering a full page reload. The route manifest file can be found in `/build/client/assets/manifest-[hash].js`.

Only relevant changes to the current visited route result in the internal version comparison. Since our app is designed with three heavy routes (FormFlowPage, ResultPage, VorabcheckPage), it is very likely that a supposedly irrelevant change in the codebase affects one of these routes.

The bug is also present on other pages, but above mentioned page is particularly affected. This is due to the textareas that require the user to type significant content which potentially needs a long time in which a new deployment is more likely.

Related Github issue: https://github.com/remix-run/react-router/issues/13332

## Considererd Solutions

| Solution                                       | Pros                                      | Cons                                                      |
| ---------------------------------------------- | ----------------------------------------- | --------------------------------------------------------- |
| Save input on keystroke to Redis               | State-of-the-art.                         | Increases traffic; edge-case behavior with no-JS clients  |
| Save input on keystroke to local storage       | Easy to implement client-side             | No single source of truth; security concerns              |
| Intercept the `__manifest` endpoint            | Could block or handle 204s                | Hacky, framework-internal                                 |
| Disable lazy route discovery (aka fog-of-war)  | Simple config; resolves manifest mismatch | Possible performance penalty for heavy routes             |
| Split large textarea fields over several pages | Minimal code change                       | Only mitigates the problem; does not fix underlying cause |
| Warn user about hard reload                    | Common pattern in web apps                | Bad UX; requires user attention                           |

## Decision

We decided to disable lazy route discovery globally across the application.

This feature was introduced as FutureFlag in Remix 2.10.0 and was enabled in our app on 2024-11-11 ([link to commit](https://github.com/digitalservicebund/a2j-rechtsantragstelle/commit/c47aeeb538f8637d125292671fc011e41591336b)).

Disabling lazy route discovery avoids the bug because the full route manifest is loaded upfront. See https://reactrouter.com/explanation/lazy-route-discovery

While this change increases the initial payload size, the impact is acceptable given the significant improvement in UX reliability and stability. The trade-off favors predictable behavior over performance gains.

## Consequences

Implementation:

- Lazy route discovery will be disabled globally in the React Router configuration.
- "Detected manifest version mismatch, reloading..." error will be removed from Sentry ignore list. This was added on 2025-04-28 ([link to commit](https://github.com/digitalservicebund/a2j-rechtsantragstelle/pull/2016/commits/c23d9099508499b4b2c9be9cfa4aa0c98892e58d))

Performance monitoring:
We will track initial page load times and Sentry performance metrics to verify that the increased payload size remains within acceptable limits.
