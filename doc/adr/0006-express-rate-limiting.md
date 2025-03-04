# 6. Express Rate Limiting

## Status

- 2024-06-04: Drafted
- 2024-06-24: Approved
- 2024-07-24: Edited (Fixed title number)
- 2025-04-04: Edited (Added chronological status)

## Context

We did a threat modeling and discovered that our pdf creation route is exposed to an "accidental" DoS attack.
It takes a lot of time to create a pdf with the given data and so is especially vulnerable to multiple requests to this one page.

## Decision

We decided to employ a rate limiting mechanism on the specific route.
The following options were explored:

1. handling it on an infrastructure level by employing rate limiting in a WAF.
   - downside: This was excluded due to previous problems with IP addresses in other projects.
2. [Express rate limiting](https://express-rate-limit.mintlify.app/overview) with in-memory store.
   - upside: Rate limiting is handled before reaching the core application logic, reducing load and potential abuse early in the request lifecycle.
   - downside: Only possible to track limits _per pod_.
3. Storing the number of requests per user in redis on every loader + action call.
   - upside: Having one place across all replicas where the number of requests are stored.
   - downside: This moves the responsibility to the application layer, costing more CPU power. Plus, we'll have to remember to include it in future loaders and actions
4. [Express rate limiting](https://express-rate-limit.mintlify.app/overview) with Redis store.
   - upside: Having one place across all replicas where the number of requests are stored. Handling rate limiting before reaching the application.
   - downside: Having two places that create a redis client and call the redis

We decided to go with option 4: Express rate limiting with Redis store.

## Consequences

- Being able to track rate limits across multiple pods.
- Two places to instantiate a Redis client and call the redis.
