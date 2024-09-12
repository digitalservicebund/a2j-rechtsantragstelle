# 11. Distinguishing UserInputSchema, Userdata, and XState Context

Date: 2024-09-10

## Status

Accepted

## Context

XState, our dependency that we use for (flow) state machines, calls the data object that it uses for decision inside guards [context](https://stately.ai/docs/context). This has led to ambiguity, as we have referred to multiple concepts, including userdata instances and userdata schemas, as "context".

## Decision

We want to use distinct names for the following three things:

### 1. UserInputSchema

A key:schema mapping that represents all data fields that could be collected in a form. It is used to build a form submission validator, where the correct schema is looked up via its field name.

```typescript
import { z } from "zod";

const userInputSchema = {
  firstname: z.string(),
  lastname: z.string(),
};
```

Note: Because we validate on both front and back-end, all schemas must be isomorphic, ie run in both environments! Server-only validation can be achieved using the `serverOnly$` function.

### 2. Userdata

Specific instance of data collected via form submissions in a flow. The type representing an instance can be infered via a (partial) `UserInputSchema`:

```typescript
import { userInputSchema } from "./userInputSchema"; // See above

const _partialSchema = z.object(userInputSchema).partial();
type UserInputSchema = z.infer<typeof _partialSchema>;

const userdata = {
  firstname: "Jane",
} satisfies UserInputSchema;
```

### 3. Context

Any runtime data in the domain of xstate, used for example during [setup](https://stately.ai/docs/setup), [typing](https://stately.ai/docs/typescript#specifying-types) and inside [guards](https://stately.ai/docs/guards#guard-object). This is usually a combination of userdata and some optional additional data (currently called `pageData`):

```typescript
type Context = UserInputSchema & { index: number };
type Guard = ({ context: Context }) => boolean;
const isLongName: Guard = ({ context }) => context.firstname.length > 5;
```

Note: We do not use xstate's [assign mechanism](https://stately.ai/docs/context#updating-context-with-assign) to update context.

## Consequences

- Refactor needed to update documentation and rename types, variable names, function arguments for 1. and 2.
- Improved clarity while reasoning about code
- Better readability and navigation inside our codebase
