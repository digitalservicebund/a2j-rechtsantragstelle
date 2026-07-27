#### Unit tests

- run: `pnpm run test`
- run in [watch mode](https://vitest.dev/guide/features.html#watch-mode): `pnpm run test:watch`
- run with coverage: `pnpm run test:coverage`
- run subset: `pnpm run test "STRING_TO_MATCH"`

Test cases are defined as follows:

```
weitereAngaben: [                               <--- Descriptive test name containing an array of steps
    {                                           |
        stepId: "/persoenliche-daten/beruf",    |
        userInput: {                            | Discrete step in a flow, usually containing both the
            beruf: "Softwareentwickler:in",     | stepId, and any user-entered data (will be validated
        },                                      | against pageSchema)
    }                                           |
    {
        stepId: "/weitere-angaben",
        userInput: {
            weitereAngaben: "",
        },
    }
]
```

##### Testing arrays

Below you'll find an example of how to test adding array items:

```
{
    stepId: "/finanzielle-angaben/eigentum-zusammenfassung/zusammenfassung",   <--- Start from summary page
    addArrayItemEvent: "add-geldanlagen",                                      <--- Explicitly name the add array item event
                                                                                    to trigger special array item logic
},
{
    stepId: "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/art", <--- Explicitly add array index, 0 here
    userInput: {
        "geldanlagen#art": "wertpapiere",                                      <--- Hashtax syntax matches pageSchemas
        geldanlagen: [                                                         |
            {                                                                  | Many steps include guards that explicitly check
            art: "wertpapiere",                                                | array indices and array items' properties. For this,
            },                                                                 | you need to define the array itself, as well as
        ],                                                                     | the pageData containing arrayIndexes, in order
        pageData: { arrayIndexes: [0] },                                       | for the test to pass
    },
},
{
    stepId:
    "/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/wertpapiere",
    userInput: {
        "geldanlagen#eigentuemer": "myself",
        "geldanlagen#wert": "1000",
    },
},
...
```

##### Skipping pageSchema validation

Often you'll find yourself testing a transition between states in which previously-entered user data is relevant for the purposes of a guard, but irrelevant for validating against the current page's pageSchema. Here we'll want to use the `skipPageSchemaValidation` property:

```
partnerschaftYes: [
    {
      stepId: "/finanzielle-angaben/eigentum/eigentum-info",                    <--- Step without pageSchema
      skipPageSchemaValidation: true,
      userInput: { partnerschaft: "yes" },                                      <--- User data, entered sometime before this step
    },
    {
      stepId: "/finanzielle-angaben/eigentum/heirat-info",                      <--- Guarded step, requiring partnerschaft: "yes"
    },
]
```
