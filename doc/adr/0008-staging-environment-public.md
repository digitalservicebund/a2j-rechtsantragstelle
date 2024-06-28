# 8. Staging environment public

Date: 2024-06-28

## Status

Agreed

## Context

Previously, accessing the staging environment required user and password authentication. However, this posed issues for external users who needed access, leading to the decision to remove authentication and make the staging environment public.

### Issue

With ADR 0005, we created the preview environment, eliminating the need to share the staging environment with external users. However, the staging environment remains public, making it accessible to everyone. This public access could result in interruptions due to issues with the Strapi API, potentially disrupting our development workflow.

## Decision

We have decided to keep the staging environment public to avoid additional development work. We believe that this approach will not lead to significant issues in the future.

## Consequences

- Any external user can access our staging environment without needing authentication.
- Reduced development work effort.
