# 19. User-uploaded File Storage

Date: 2025-01-21

## Status

Accepted

## Context

When users fill out an Antrag, oftentimes they will need to upload additional documents as a part of their application. We currently do not have a file upload and storage architecture in place, and need to decide how we'd like to implement one. A few considerations:

- We need to also be able to store metadata about the file, like which session it came from, the size of the file, etc.
- Files, like user data, must also be deleted after 24 hours, when the cookie gets invalidated.

## Proposal

We store the actual file in bucket storage, and the accompanying metadata along with the user's session data in Redis. The flow might look someting like this:

1. User clicks upload button. API request to bucket storage is made with the file and session ID/some hash of the current session to link the two together.
   1. Upon failure, display error to user
   2. Upon success, store returned entity ID along with file metadata in an array, something like `filesUploaded`, alongside Antrag data in Redis.
2. During Zusammenfassung, files are retrieved via their entity IDs from bucket storage and displayed to the user for verification, later merged into PDF
3. If a user deletes a file, make an API delete request, and upon success, erase the matching entry in the Redis/user data

## File Expiration problem

We need a way to expire the user-uploaded files at the same time that their session cookie gets invalidated, i.e. 24 hours after upload. For this, we have several options. For now:

- Set bucket object expiration to 24hrs. If user session data outlives file lifetime, oh well.

To think about later:

- [Redis Pub/Sub client listening to EXPIRY events](https://redis.io/docs/latest/develop/use/keyspace-notifications/#timing-of-expired-events); upon EXPIRY, delete any associated files in bucket storage
  - Could live in the app as a singleton service that listens to Redis expiration events

## Alternatives considered

We considered simply storing the file in Redis, but ultimately decided against it because:

- Cache hits/page loads with blob data would be really slow
- Redis memory is limited as-is, and we'd probably have to find a way to compress or snapshot our data to avoid this
- Migrating from Redis -> a relational database (like when we start handling user accounts) is painful, but migrating from bucket storage is not

## Consequences

- We'll need a new, separate bucket for user-uploaded files

## Next Actions

Build minimal proof-of-concept, including an "ugly" upload button and all infrastructure, available behind a feature flag on Staging.
