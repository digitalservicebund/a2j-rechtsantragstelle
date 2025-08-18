# 24. Migrating to `Tailwind 4`

Date: 2025-08-18

## Status

- Accepted

## Context

Tailwind has released version 4, a major update that introduces several breaking changes as documented in the [official upgrade guide](https://tailwindcss.com/docs/upgrade-guide). One of the key changes is the updated browser support policy::

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

We also tested unsupported versions on BrowserStack. With production builds, the site displayed correctly without styling issues. However, with development builds, some styles did not render as expected.

## Decision

We decided to proceed with migrating to Tailwind 4. The percentage of users on unsupported browsers is low. Production builds show no styling issues and we do not run development builds in the production cluster.

## Consequences

- Tailwind will run on production with the latest version.
- We can adopt the newest features and improvements available in Tailwind 4.
