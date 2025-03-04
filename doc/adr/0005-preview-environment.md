# 4. Preview/Test Environment

## Status

- 2024-05-14: Drafted
- 2024-05-17: Merged
- 2025-04-04: Edited (Added chronological status)

## Context

Initially, we maintained two environments at A2J: staging and production. Our workflow proceeded as follows:

1. Engineers initiated feature development.
2. Upon completion of the task, changes were pushed to the main branch.
3. Finally, changes were firstly tested with E2E test, then deployed to staging and production environments

### Issue

Despite collaboration with external parties, we encountered a challenge with our staging link. This link, crucial for our workflow, occasionally became inaccessible due to interruptions in the Strapi API utilized within our staging environment. Any updates in Strapi Staging temporarily rendered it unavailable, as it operates with only one pod.
Additionally, we relied on Zod for runtime data validation sourced from Strapi. Any disparities between the published data and the consumer's expectations resulted in error pages.

## Decision

To address these challenges, we decided to create a preview environment. This environment serves as a hybrid between production and staging environments.

- The preview environment operates independently of the Strapi API during runtime, serving content via JSON file.
- The preview environment has all soon-to-be released features unlocked.
- App changes go through thorough testing before moving to staging and then to preview.
- Content changes are also tested before being deployed to the preview environment.
- Once the preview is confirmed successful, we conduct further testing before deploying to production.
- The preview environment is accessible without any authentication mechanism.

## Consequences

- External users won't face any issue when error occurs in the staging
- Engineers do not need to stop the development during review from the external users
