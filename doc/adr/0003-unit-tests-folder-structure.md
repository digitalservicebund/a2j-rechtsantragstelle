# 1. Unit tess folder structure

Date: 2024-04-02

## Status

Accepted

## Context

Our team acknowledges several issues with our current unit test folder structure (`\tests\unit\`):

- Difficulty in locating unit tests corresponding to implementation code
- Lack of clarity regarding test coverage
- Challenges in writing new unit tests for newly implemented code due to separation from the codebase.
- Need to independently rearrange test folders when files are moved to another path

To address these concerns, we have identified the following options:

1. Leave as is and accept the drawbacks
2. Add `__test__` folder within lowest-level app folders
3. Parallel test files in the same folder as app files
4. In-source tests

The pros and cons of these options are outlined in the image below:

![Unit test folder structure options](/doc/images/unit_tests_folder_structure.jpg)

## Decision

As a group we decided for the option 2 (`Add __test__ folder within lowest-level app folders`)

- This option requires minimal configuration and is easily implemented.
- Leveraging our current unit testing framework, `jest`, which already recognizes test files within `__test__` folders.
- Offers a more intuitive location for unit tests, particularly in the TypeScript and JavaScript ecosystem.

While the team is content with this decision, we acknowledge the potential consideration of option 3 for long-term planning.

## Consequences

- Incorrect configuration may inadvertently include test code in the production bundle.
