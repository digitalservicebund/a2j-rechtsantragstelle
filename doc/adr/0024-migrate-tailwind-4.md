# 24. Dropping full CSS support for old browsers to upgrade `Tailwind 4`

## Status

- 2025-08-11: Drafted
- 2025-08-19: Accepted
- 2025-08-25: Edited (updated chronological status)

## Context

Tailwind has released version 4, a major update that introduces several breaking changes as documented in the [official upgrade guide](https://tailwindcss.com/docs/upgrade-guide). One of the key changes is the updated browser support policy:

```
Tailwind CSS v4.0 is designed for Safari 16.4+, Chrome 111+, and Firefox 128+. If you need to support older browsers, stick with v3.4 until your browser support requirements change.
```

To evaluate the impact, we analyzed page views in PostHog from July 13, 2025 to August 13, 2025:

- Chrome
  - Total users: 174599
  - Total users no support version: 1954
  - % unsupported: 1,1%
- Firefox
  - Total users: 34271
  - Total users no support version: 1300
  - % unsupported: 3,79%
- Safari
  - Total users: 19062
  - Total users no support version: 1541
  - % unsupported: 8,08%

We tested unsupported browser versions on BrowserStack. In production builds, the site rendered correctly with no major styling issues. In development builds, however, some styles did not render as expected. One exception was observed on older Safari versions, where the “Jump to main content” button remained permanently visible even in production. Aside from this minor issue, no significant visual problems were found, and the website remained fully functional.

## Decision

We decided to proceed with migrating to Tailwind 4. The percentage of users on unsupported browsers is low. Production builds show no styling issues and we do not run development builds in the production cluster.

## Consequences

- Tailwind will run on production with the latest version.
- We can adopt the newest features and improvements available in Tailwind 4.
