# 11. Distinguishing userInputSchema, UserDataType, userdata, and Context

## Status

- 2024-09-10: Drafted
- 2024-09-12: Accepted
- 2025-04-04: Edited (Added chronological status)

## Context

XState, our dependency that we use for (flow) state machines, calls the data object that it uses for decision inside guards [context](https://stately.ai/docs/context). This has led to ambiguity, as we have referred to multiple concepts, including userdata instances and userdata schemas, as "context".

## Decision

We want to use distinct names for the following three things:

### 1. userInputSchema

A key:schema mapping that represents all data fields that could be collected in a form. It is used to build a form submission validator, where the correct schema is looked up via its field name.

```typescript
import { z } from "zod";

const userInputSchema = {
  firstname: z.string(),
  lastname: z.string(),
};
```

Note: Because we validate on both front and back-end, all schemas must be isomorphic, ie run in both environments! Server-only validation can be achieved using the `serverOnly$` function.

### 2. UserDataType

The type inferred from a (partial) `userInputSchema` object. Partial, because any instance of userdata can have any of the properties missing.

```typescript
import { z } from "zod";

const userInputSchema = {
  firstname: z.string(),
  lastname: z.string(),
};

const _partialSchema = z.object(userInputSchema).partial();
export type BeratungshilfeVorabcheckUserData = z.infer<typeof _partialSchema>;
```

### 3. userdata

A specific instance of data collected via form submissions in a flow. It should always satisfy the previously inferred `UserDataType`:

```typescript
import type { BeratungshilfeVorabcheckUserData } from "./userInputSchema"; // See above

const userdata = {
  firstname: "Jane",
  // Note that 'lastname' can be missing due to the type being partial
} satisfies BeratungshilfeVorabcheckUserData;
```

### 4. Context

Any runtime data in the domain of xstate, used for example during [setup](https://stately.ai/docs/setup), [typing](https://stately.ai/docs/typescript#specifying-types) and inside [guards](https://stately.ai/docs/guards#guard-object).
This is usually a combination of userdata and some additional data:

```typescript
import type { BeratungshilfeVorabcheckUserData } from "./userInputSchema"; // See above
type Context = BeratungshilfeVorabcheckUserData & { index: number };
type Guard = ({ context: Context }) => boolean;
const isLongName: Guard = ({ context }) => context.firstname.length > 5;
```

Note: We do not use xstate's [assign mechanism](https://stately.ai/docs/context#updating-context-with-assign) to update context.

## Consequences

- Refactor needed to update documentation and rename types, variable names, function arguments for 1. and 2.
- Improved clarity while reasoning about code
- Better readability and navigation inside our codebase
