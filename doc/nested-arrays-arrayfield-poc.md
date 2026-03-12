# Nested Arrays — `arrayField` Approach (PoC)

| Concern                | Legacy (`#`)                                                                | New (`arrayField`)                                                                                                                                                               |
| ---------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Array scope**        | Encoded in every field name: `weiterePersonen#vorname`                      | Declared once on the tree node via `arrayField: "weiterePersonen"`; field names are plain (`vorname`)                                                                            |
| **Nested arrays**      | Not possible — `#` can only encode one array level                          | Structural nesting via recursive `arrayPages`: `kinder` → `enkelkinder` builds paths like `kinder[0].enkelkinder[1].vorname`                                                     |
| **Strapi field names** | Must contain `#` (e.g. `weiterePersonen#vorname`) — unintuitive for editors | Clean names (`vorname`); array context comes from tree structure                                                                                                                 |
| **UserData types**     | Nested array shapes must be manually typed (`& { kinder?: Array<...> }`)    | Automatically inferred by `UserDataFromPagesSchema` from Zod schemas in the page tree                                                                                            |
| **Read path**          | `flattenObjectWithArrayKeys` + `resolveArrayCharacter`                      | `collectArrayFieldsForStep(pathname)` discovers applicable `arrayField`s → `resolveArrayField` + `lodash/get`                                                                    |
| **Write path**         | `resolveArraysFromKeys` + `resolveArrayCharacter`                           | `resolveArrayFieldsFromKeys` + `lodash/set` — builds nested `UserData` from flat form submission                                                                                 |
| **xState navigation**  | Flat states with `add-${arrayName}` event                                   | Nested compound states (`erbfolge → kinder → kind → enkelkinder → enkelkind`) with `add-kinder` / `add-enkelkinder` events, conditional guards, and `#id` cross-level references |

## Design draft coverage

### Erbschein — two variants

| Variant                                     | Description                                                                          | Supported by this PoC?                                                                                      |
| ------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Variante geschlossen**                    | User states number of children upfront → that many input fields rendered on one page | No — requires dynamic form generation (novel solution), unrelated to `arrayField`                           |
| **Variante Zusammenfassung** (open/summary) | User adds children one-by-one via overview page → add child → back to overview       | **Yes** — this is exactly what the PoC models with `add-kinder` events and the overview/daten state pattern |

### Fluggastrechte/TGA — two concepts

| Concept                                        | Description                                                          | Supported by this PoC?                                                                                             |
| ---------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Concept 1** (preferred) — inline per chapter | Each claimant's data is entered inline within each step of the flow  | No — requires a fundamentally different form layout where multiple array items are edited within the same page     |
| **Concept 2** — separate flow per claimant     | Each claimant fills out a separate subflow, returning to an overview | **Yes** — this matches the existing `weiterePersonen` array pattern, now with cleaner field names via `arrayField` |

## Limitations

- **Not visible in the browser** — erbfolge states are not wired into the live wegweiser flow (vorabcheck routes don't support array page rendering), and the fluggastrechte migration is pages.ts-only
- **Custom xState IDs** — nested compound states require `id` + `#id` references for cross-level navigation, which can break the progress bar calculation if applied to states in the SUBMIT path
- **`add-${string}` type widening** — nested array event names (e.g. `add-enkelkinder`) aren't in `AllUserDataKeys`, requiring a broader event type and a cast in tests
- **No summary/overview rendering**
