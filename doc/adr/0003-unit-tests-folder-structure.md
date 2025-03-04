# 3. Unit tess folder structure

## Status

- 2024-04-02: Drafted
- 2024-04-05: Merged
- 2024-04-26: Edited (Rewording to simplify)
- 2024-05-17: Edited (Fixed title index)
- 2025-04-04: Edited (Added chronological status)

## Context

Our team acknowledges several issues with our current unit test folder structure (`\tests\unit\`):

- Difficulty in locating unit tests corresponding to implementation code
- Challenges in writing new unit tests for newly implemented code due to separation from the codebase.
- Need to independently rearrange test folders when files are moved to another path

To address these concerns, we have identified the following options:

1. Leave as is and accept the drawbacks
2. Add `__test__` folder within lowest-level app folders
3. Parallel test files in the same folder as app files
4. In-source tests

The pros and cons of these options are described below:

| Options                                                | Pro                                                                                                                                                                                                      | Cons                                                                                                                                                                               |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1) Leave as is                                         | 1. No additional work <br> 2. Don't get "distracted" by tests when working on application                                                                                                                | 1. Hard to find unit test of the implementation code <br> 2.Hard to see what is covered                                                                                            |
| 2) \_\_test folder within lowest-level app folders     | 1.Tests (slightly) closer to the implementation <br> 2. Obvious if code is untested <br> 3. Minimal config change                                                                                        | 1.Incorrect config would include test code into bundle                                                                                                                             |
| 3) parallel test files in the same folder as app files | 1.tests directly next to the source code file <br> 2.Obvious if code is untested <br> 3.Easy to find test code from implementation                                                                       | 1.Incorrect config would include test code into bundle <br> 2.Doubles the amount of files per folder                                                                               |
| 4) in-source tests                                     | 1.Tests directly next to source code <br> 2.Obvious if code is untested <br> 3.No unnecessary exports <br> 4.Unit test as documentation inside the same file <br> 5. No need to open multiple files <br> | 1.It's not support from Jest, would need to move to vitest <br> 2. Longer file length <br> 3. Incorrect config would include test code into bundle <br> 4. Long file as code smell |

## Decision

As a group we decided for the option 2 (`Add __test__ folder within lowest-level app folders`)

- This option requires minimal configuration and is easily implemented.
- Leveraging our current unit testing framework, `jest`, which already recognizes test files within `__test__` folders.
- Offers a more intuitive location for unit tests, particularly in the TypeScript and JavaScript ecosystem.

While the team is content with this decision, we acknowledge the potential consideration of option 4 for long-term planning.

## Consequences

- Incorrect configuration may inadvertently include test code in the production bundle.
