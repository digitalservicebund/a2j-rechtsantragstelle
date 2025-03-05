# 10. No Caching while cookie banner visible

## Status

- 2024-09-02: Drafted
- 2024-09-09: Accepted
- 2025-04-04: Edited (Added chronological status)

## Context

Normally, any interaction with the cookie banner (accepting or declining) should hide it until cookies expire or data is actively deleted. However, we encountered a problem where the cookie banner would reappear under certain circumstances:

When the user after interacting with the banner navigates to another page and then clicks the browser's back button, the browser cache will serve the previously cached page version with the banner still visible. Because the visibility state of the banner is checked on `GET` request, the cached page would still contain the visible cookie banner.

## Decision

We decided to ask the browser to not cache pages while the cookie banner is visible by setting the `Cache-Control: no-store` header while the cookie state is `undefined`.

This ensure that user interactions with the cookie banner are accurately reflected across pages, as no page WITH cookie banner can be saved into cache.

## Consequences

- Browsers always perform a full GET request before the cookie banner has been interacted with
- This slightly increases network traffic and server load
- We expect this to be minimal due to the relatively low number of users and the static nature of most of our pages
