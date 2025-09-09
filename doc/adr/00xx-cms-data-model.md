# 14. CMS Data Model

## Status

- 2024-10-18: Draft 1
- 2025-03-10: Draft 2

## Context

Currently, we have three collections that contain content for pages inside flows (`flowPages`, `vorabcheckPages`, `resultPages`) as well as some menu-related string in a separate collection (`translations`, scoped under `service.menu`, for example `beratungshilfeAntrag.menu`).

Each page is assigned to a service via one or more `flowId`, and to a specific slug via the `stepId`. A page may contain `content` components (such as `paragraph`, `heading`, ...) as well as of `form` components (such as `dropdown`, `radiogroup`, ...). Each form component specifies its `name`, `type` and possible answer options, as well as labels.

The link between the labels and the app-side schema of a field is via the `name` property.

### Example

```
/flowPages
    [ {
        flowIds: ["beratungshilfeFormular"],
        stepId: "/adresse",
        content: [Headline, Paragraph, ...],
        form: [
            street: {
                type: text,
                label: Straße,
            },
            number: {
                type: number,
                label: Hausnummer,
            },
            inGermany: {
                type: radio,
                label: In Deutschland,
                answers: {
                    yes: "Ja, in Deutschland",
                    no: "Nein, im Ausland",
                }
            },
        ]
    },
    ...
    ]
/vorabcheckPages
    /...
/resultPages
    /...
/translations
    /service.menu
    /...
```

### Downsides

There are several places where labels for form fields can be needed:

- on a page the field is presented
- on a array summary page
- on a submission page
- in a pdf

By nesting the fields inside a page, we basically cannot re-use the labels between all these separate scenarios, let alone across multiple services.

Furthermore, moving fields between pages is very hard, let alone re-use across services.

## Decision

### Option 1: Separate fields collection

We could create a new collection `formFields`, which contains all form fields across all flows. They are assigned to a specific page via a

### Stage 2 (potentially): Split pages by domain

Following ADR 0012, content in the CMS should be separated by domain, under a top-level `/services` collection:

```
/services
    /beratungshilfe
        /antrag
            /menu {start: Start, ...}
            /formfields
                /hasPartner: {
                    type: radio,
                    label: Partner,
                    answers: {
                        yes: Ja,
                        no: Nein
                    }
                }
                /kinder: {
                    type: array,
                    ...}
            /pages
                /partner: {
                    heading: "Haben Sie Partner",
                    content: "asdasd",
                    fields: [hasPartner]
                }
        /vorabcheck
            /fields
            /pages
```

```
/services
    /beratungshilfe
        /antrag
            partner: {
                heading: "Haben Sie Partner",
                content: ["asdasd"],
                fields: [
                    {
                        id: hasPartner
                        type: radio,
                        label: Partner,
                        answers: {
                            yes: Ja,
                            no: Nein
                        }
                    },
                ]
            },
            grundvoraussetzungen: [
                menuLabel: "Persönliche Daten",
                pages: [
                    /name: {
                        heading: "Ihr voller Name",
                        content: [],
                        fields: [
                            {
                                id: firstName,
                                type: text,
                            },
                            {
                                id: lastName
                                type: text,
                            }
                        ]
                    },
                ]

            ]
        /vorabcheck
            ...
```

### Future consideration: content structure as code

Currently, the fields are hard-coded to match the name and type inside the app.

Instead, we could publish the pages configuration:

```typescript
// GET /beratungshilfe/antrag/fieldnames
{
     "/finanzielleAngaben/partner": {
        "hasPartner": {
            type: radio,
            answers: [yes, no]
        }
    }
}
```

which could be consumed by the CMS to pre-populate the `/fields` collections of each service.

## Consequences
