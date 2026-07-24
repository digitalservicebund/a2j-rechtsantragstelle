# ADR: Testing-Feature Environment

## Status

- 2026-07-24: Drafted

## Context

As defined in [ADR-05](./0005-preview-environment.md), we currently have three environments for our application (staging, preview and production). All of these are deployed only after source code changes have been merged to the `main` branch. Sometimes, though, we need to build complex features that span multiple commits before they're ready for `main`. Engineers can already verify such changes locally, but our Product and Design team also needs to review and validate them before the work is merged. We can't deploy this work-in-progress directly to production, and feature flags aren't a viable option when the changes are too complex or too invasive to toggle safely at runtime.

We need a way for Product and Design to access and test in-progress changes from a branch, without affecting real users or requiring the code to be merged first.

**Key constraints and considerations**

- Changes must be reviewable in a running environment before they are merged to `main`.
- The production, staging and preview environments must remain unaffected.
- Deployment to this environment must be a deliberate, manual action — it should not happen automatically on every push, to avoid unnecessary rebuilds and deployments while a branch is still being iterated on.
- Any authorized engineer should be able to trigger the deployment; it should not require a separate manual-approval/reviewer step.

## Decision

Create a new environment called `testing-feature`, which can be deployed on demand from a long-lived branch (`APL-266-feature-release`) rather than from `main`.

- A dedicated reusable GitHub Actions workflow (`testing-feature.yml`) builds and publishes a separate Docker image, `prod-testing-feature`, distinct from the regular `app`/`prod` images used for staging/preview/production.
- The image is signed with `cosign` and scanned with `Trivy` before being pushed, following the same security practices used for the production image.
- Deployment is triggered manually: pushes to `APL-266-feature-release` run the regular CI checks (code quality, e2e tests, image build) automatically, but the actual deployment to `testing-feature` only runs when someone explicitly dispatches the `ci-pipeline.yml` workflow via `workflow_dispatch`, and only after those CI checks have passed. This avoids a formal reviewer/approval gate while still ensuring nothing broken gets deployed.
- Product and Design team members can access the `testing-feature` environment to review and validate changes before they are merged to `main`.

## Consequences

- Product and Design can validate complex, multi-commit changes in a running environment before they are merged, without waiting for a full release cycle.
- Production, staging and preview remain unaffected, since `testing-feature` is deployed from a separate branch and image.
- Requires minor additional CI/infrastructure maintenance: an extra reusable workflow, an extra Docker image target, and an extra environment/deployment target in the infra repo.
- Because deployment is manual, the `testing-feature` environment can become stale relative to the branch until someone re-triggers the workflow; it is not intended to always reflect the latest commit automatically.

## Future Considerations

Right now, deployment to the `testing-feature` environment is only possible from the single long-lived branch `APL-266-feature-release`. We should consider replacing this with a dedicated branch naming convention, such as `testing/features/{name-of-new-branch}`, so that changes from any feature branch matching that pattern can be deployed to this environment. However, we would first need to check whether this is feasible with our current infrastructure.
