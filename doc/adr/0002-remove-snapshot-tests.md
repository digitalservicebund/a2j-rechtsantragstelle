# 2. Remove snapshot tests

## Status

- 2024-03-12: Drafted
- 2024-03-14: Merged
- 2024-05-17: Edited (Fixed title index)
- 2025-04-04: Edited (Added chronological status)

## Context

Several team members believe that the efforts of keeping snapshot tests are not worth the effort.

There have been several external reasons to make a decision as to keep snapshot tests, such as the current tool [storyshots](https://storybook.js.org/addons/@storybook/addon-storyshots/) (storybook plugin) being [deprecated](https://github.com/storybookjs/storybook/issues/24657). With the recent [v8.0.0 release of storybook](https://github.com/storybookjs/storybook/releases/tag/v8.0.0), the plugin is now officially unsupported. The previous snapshot test setup was removed and marked as `todo`.

We consider to either fully remove snapshot tests altogether or follow the [migration guide](https://storybook.js.org/docs/writing-tests/storyshots-migration-guide) to move to the new [Storybook test runner](https://storybook.js.org/docs/writing-tests/test-runner).

## Decision

As a group we decided NOT to migrate to the new test configuration but instead REMOVE snapshot tests:

- Nobody gained additional confidence from snapshot tests
- Most felt updating snapshots to be an unneeded chore
- Some mentioned snapshot tests failing in unforeseen and hard-to-debug ways
- Some felt reducing dependencies and speeding up tests are helpful
- All agreed to instead commit to writing component / interaction tests

## Consequences

- The previous snapshot test implementation was already removed in the update to [storybook v8.0.0](https://github.com/digitalservicebund/a2j-rechtsantragstelle/commit/ad46328c199c890c1e0c6971f6994ee0267177b3) (commit `ad46328`), no action needed.

- With merging of this ADR, the test file containing the reminder will be removed.

- A ticket for adding component test already exists, the current priority on implementing them was noted there.
