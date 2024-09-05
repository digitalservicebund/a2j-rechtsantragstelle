# 10. Cache-Control: No Store

Date: 2024-09-02

## Status

Accepted

## Context

We encountered a problem where the cookie banner on [https://service.justiz.de/](https://service.justiz.de/) reappears even after it has been accepted or declined. This behavior occurs when the user navigates back to a previous page using the browser's back button.

After investigation, we discovered that the browser caches the previous page, leading to the display of outdated information when returning to a page after the banner has been accepted on a different page.

## Decision

To prevent the stale page issue and ensure that user interactions with the cookie banner are accurately reflected across pages, we decided to set the `Cache-Control: no-store` header in the client-side responses when the cookie banner is neither accepted nor rejected.

## Consequences

- The solution resolves the issue of stale pages by making sure the browser always retrieves the most up-to-date content.
- As a result, when users click the back button, the page has to be fetched from the server each time.
- Each page request forces the server to generate the page from scratch, which can increase server load and response times.
