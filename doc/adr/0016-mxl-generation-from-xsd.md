# 16. Generating XMLs filled with user data according to given XSDs (xjustiz)

Date: 2025-01-14

## Status

Accepted

## Context

We want to send messages to courts that include XMLs in the xjustiz format.
This format/schema is defined by given XSD files that can be downloaded [here](https://xjustiz.justiz.de/index.php).
Our first use case is a schema for beratungshilfe.
The goal is to take the given XSD as a baseline, generate TypeScript objects/types out of it, fill those objects with user data and generate an XML from that, following the given structure.

## Options

There are three options to implement that we considered:

### (1) Generating TypeScript types from the XSD & generating XML with two distinct TypeScript libraries.

We quickly found a suitable library to generate XML from TypeScript objects: `fast-xml-parser`.
It is very active, popular, has very limited dependencies, extensive documentation and shows great performance.

For the parsing of XSD into TypeScript types we considered the following libraries: `xsd2ts`, `xsd-json-converter`, `wikipathways/cxsd` and the fork `loanlink-nl/cxsd`.
We could only bring one of them to work with our XSDs: `wikipathways/cxsd`.
However, the library is unmaintained for six years now and thus does not seem suitable.
Also, the resulting types still need some manual work after generating.

### (2) One-time/manually generating TypeScript types & generating XML a TypeScript library.

That sparks the question if we could do the type generation from XSD by ourselves while only relying on libraries for the TypeScript-to-XML-parsing.
For the initial generation we could even still use a library for the one-time generation.
It comes with the obvious pitfall, that we'll have to manually update on any change to the schema that will happen in the future.

### (3) Generating Java objects from the XSD & generating XML in a separate Java microservice.

Instead of doing it in our main TypeScript app, we can also spin up a microservice in Java.
Java has powerful, mature libraries like `jaxb` that can do both tasks for us.
That would need a new service with according interface in our cluster which entails deployment and maintenance effort.
Also, we create two very distinct places to handle business logic.

## Decision

After consideration, we think that approach (2) is the most suitable for our case.
It is closer to our core application logic than a separate microservice and no new repository and language to maintain.
Also, we do not buy-in a very outdated library.

## Consequences

We will create a new service in our `/services` module for generating xml.
Within that we define the types to be "filled" with data and ultimately generate XML using `fast-xml-parser`.

Upon changes to the schema, we will have to manually adapt the types.
However, we expect this to not happen very often, as the schemas are only updated at most once a year.
