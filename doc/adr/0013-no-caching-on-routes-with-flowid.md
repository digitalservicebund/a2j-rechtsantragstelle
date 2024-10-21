# 13. No Caching on routes with FlowId

Date: 2024-10-18

## Status

proposed

## Context

Related to ADR 10, we have still encountered problems on the Formular and Vorabcheck pages.

When the user interacts with our Formular or Vorabcheck and goes through the pages, and then the user clicks the browser's back button, the browser cache will serve the previously cached page version, and we sometimes lose the state of the user's inputs, especially select fields.

## Decision

We decided to ask the browser to not cache pages also if the user is on one of our FlowId Pages and we set the `Cache-Control: no-store` header.

This ensures that the user's interactions with the Formular and Vorabcheck pages function correctly across pages, as none of the pages can be cached.

## Consequences

- Browsers will always execute a complete GET request on any FlowId Page
- This will significantly increase network traffic and server load
- We anticipate that the impact will be manageable due to the relatively low number of users and the static nature of most of our pages
