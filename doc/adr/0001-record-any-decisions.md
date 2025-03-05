# 1. Record any decisions

## Status

- 2023-08-24: Drafted
- 2025-04-04: Edited (Added chronological status)

## Context

We want to record (important) decisions made on this project.
ADRs are an established tool for this purpose.
We are a bit insecure about the jargon (e.g. architectual significance) around ADRs.

## Decision

We considered two template options.

The _classic_ [Nygard template](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions) is very visible and well adopted and plenty of [tooling](https://adr.github.io/#decision-capturing-tools) exists. It's also already used in the company by other teams.

The more _modern_ [MADR 3.0.0](https://adr.github.io/madr/) is offered as a template to capture any decisions, as its makers believe that any (important) decision should be captured - not only architectural significant ones. It broadens the scope of ADRs to "Any Decision Records" and advocates to not take the term "architecture" too seriously. It lacks adoption and tooling support.

We decided to use the _Nygard_ template with a little twist. Instead of only using it for architectural decisions, we will use it also for other (important) decisions, hence calling them _Any Decision Records_.

## Consequences

With [adr-tools](https://github.com/npryce/adr-tools) it's as frictionless as possible to start working on a new ADR. Others can find our ADRs in the expected place `doc/adr` and in the familiar Nygard format.

By defining ADRs as _Any Decision Records_ it will hopefully be less daunting to record a decision. The resulting decision log might be architecturally less terse but that is a trade-off we are willing to accept if it increases the chance that decision logging becomes a habit of the team.
