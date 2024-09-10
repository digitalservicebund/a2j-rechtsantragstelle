# 11. Userdata and context

Date: 2024-09-10

## Status

Accepted?

## Context

XState, our dependency that we use for (flow) state machines, calls the data object that it uses for decision inside guards [context](https://stately.ai/docs/context). This lead us to call many different things "context", such as instances of userdata and even the schema of userdata.

## Decision

We want to use distinct names for the following three things:

### 1. Userdata Schema

A key:schema mapping that represents all data fields that could be collected in a form. It is used to lookup schema validators by fieldname.

```typescript
import { z } from "zod";

const flowSchema = {
  firstname: z.string(),
  lastname: z.string(),
};
```

Note: Because we validate on both front and back-end, all schemas must be isomorphic, ie run in both environments! Server-only validation can be achieved using the `serverOnly$` function.

### 2. Userdata

Specific instances of data collected via answers of a user to questions in a flow. The type representing an instance can be infered via a partial userdata schema:

```typescript
import { flowSchema } from "./flowSchema"; // See above

const _partialSchema = z.object(flowSchema).partial();
type FlowUserData = z.infer<typeof _partialSchema>;

const userdata = {
  firstname: "Jane",
} satisfies FlowUserData;
```

### 3. Context

Any data object in the domain of xstate. This matches the argument name in [setup](https://stately.ai/docs/setup), [typing](https://stately.ai/docs/typescript#specifying-types) and [guards](https://stately.ai/docs/guards#guard-object). This is usually a combination of userdata and some optional additional data (currently called `pageData`):

```typescript
type Context = FlowUserData & { index: number };
type Guard = ({ context: Context }) => boolean;
const isLongName: Guard = ({ context }) => context.firstname.length > 5;
```

Note: We do not use xstate's [assign mechanism](https://stately.ai/docs/context#updating-context-with-assign) to update context.

## Consequences

Refactor:

- Rename of all types, variable names, function arguments and names for 1. and 2.
- Update of documentation
