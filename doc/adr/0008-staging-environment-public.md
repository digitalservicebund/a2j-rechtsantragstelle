# 8. Staging environment public

## Status

- 2024-06-28: Drafted
- 2024-07-02: Accepted
- 2025-04-04: Edited (Added chronological status)

## Context

Previously, accessing the staging environment required HTTP basic authentication. However, this posed issues for external users who needed access due problems with their devices or browsers to enter the credetials with HTTP basic authentication, leading to the decision to remove authentication and make the staging environment public.

### Issue

With ADR 0005, we created the preview environment, eliminating the need to share the staging environment with external users. However, the staging environment remains public, making it accessible to everyone. This public access could result in the following issues:

- DDOS against staging will impact our ability to continue working (mitigated by OTC load balancer & DDOS protection)
- Leaking of non-public information (mitigated by generally working publicly and knowledge about staging being open)

## Decision

We have decided to keep the staging environment public to avoid additional development work. We believe that this approach will not lead to significant issues in the future.

## Consequences

- Any external user can access our staging environment without needing authentication.
- Reduced development work effort.
