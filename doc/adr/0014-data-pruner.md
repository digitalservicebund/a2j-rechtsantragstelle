# 14. Introduce a pruner function to filter relevant data

Date: 2024-10-24

## Status

Accepted

## Context

Our forms collect data over multiple steps.
Which steps are shown (hence, which data is collected) is decided based on the previously inputted data.

For an example we have a step A deciding whether to show step B or C.
If you input "yes" to Question A, you answer question B.
After doing that, you can go back to Question A, selecting "no".
That makes the data you put into question B obsolete, because now, instead, you have to answer question C.

We have this phenomenon in many cases in our flow.
The point where the problem surfaced was on the ArraySummary pages where we display all collected data of a sub-flow.
This then showed the data from questions A, B, and C which is actually an inconsistent state.

## Decision

We decided to implement a function - the "pruner" - to prune away irrelevant data.
In the example above, the data from question B would be omitted, only leaving relevant data.
This will be executed in all relevant places, including PDF creation and flow decisions (execution of guards).

To enable that, we traverse all steps with our xstate flow logic and gather the enabled ones.
The information which field lives on which page is not encoded in the application, but in Strapi, so we have to query Strapi / the content file for that information.
With the information of which steps are enabled and which fields are queried on those steps, we can filter the available data for the relevant fields.

## Consequences

- Data will be filtered on every call to a loader and action.
- This will lead to longer-running requests which are especially bad in the Staging environment as it includes a full roundtrip to Strapi.
- We do not have to double-check previous decisions in the flow logic (guards) anymore.
- We do not have to double-check if the data is relevant when filling the PDF.
- Both hopefully lead to fewer bugs because of complex flows and less code duplication.

## Next Actions

Already implemented in https://github.com/digitalservicebund/a2j-rechtsantragstelle/pull/1074.
