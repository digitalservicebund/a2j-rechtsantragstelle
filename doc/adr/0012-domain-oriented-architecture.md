# 12. Splitting domain configurations and application logic

Date: 2024-10-07

## Status

Accepted

## Context

We started this project developing only one flow for one domain (Vorabcheck for Beratungshilfe).
Since then, we shifted towards developing an application that is thought to host a lot of different forms.
They all are in the justice space, but still vary in the specific domain within justice.
For example, the domain knowledge you need is very different from a Beratungshilfe form to a Fluggastrechte form.
They all have in common that they need forms, content, data validation etc. (from now on called "application logic").
The only thing that is really different is the configuration of those.
Currently, we are mostly separating the domains' configurations from the application logic withing the folder "flows".
However, some parts of the domain configuration still reside in other modules, e.g. the PDF filling logic.

## Decision

We want to make an effort to separate domain logic (i.e. configurations) even more from the application logic (e.g. how to interpret flow configurations).
The goal is: If you want to add a new domain/form to the platform, you only have to touch _one_ place (maybe two, including `routes`), and it is very clear which one that is and what you have to/can configure there.
We follow the following naming:

- domain: An area in the justice space that needs specific knowledge, e.g. `beratungshilfe`
- flow: A sequence of form steps to be completed within a domain, e.g. `beratungshilfe vorabcheck`
- flowId: The identifier to differentiate between different flows, e.g. `/beratungshilfe/vorabcheck`

## Consequences

"To Dos:"

- A new folder is created called `domains`. In that we have a folder for each domain, e.g. `beratungshilfe`, `fluggastrechte`. In those we have more folders depicting the specific flows of the domain, e.g. `vorabcheck` and `formular`.
- There might be a domain-overarching folder called `shared` for domains very similar to each other, like `beratungshilfe`and `prozesskostenhilfe` or domain-irrelevant things like `persoenlicheDaten`.
- Things that are now specific to one service should reside in the `domains` folder. That includes:
  - domain specific data, for example airports
  - pdf filling logic + handout generation
  - Strapi "extra" flowIDs
  - Vorabcheck progress configuration
  - Flow transition logic
  - `WEITERE_PERSONEN_START_INDEX` in the ArraySummaryDataItems
  - `FluggastrechteResultPage` in components
  - probably some more
- A Readme on "how to add a new domain/form" would be beneficial.

Expected Benefits:

- It is clear where to add a new domain/form to the application.
- It is very clear when I as a developer edit domain-specific logic and when I add things to the overarching application logic.
- Possibly: Domains do not "interfere" with each other quite that much as they are kept separate.

Expected drawbacks:

- There might be more communication efforts necessary when changing application logic as it affects other/all domains.
