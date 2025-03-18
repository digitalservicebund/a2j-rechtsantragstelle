# 18. Generating XMLs filled with user data according to given XSDs (XJustiz)

## Status

- 2025-01-14: Drafted
- 2025-01-16: Accepted
- 2025-01-22: Edited (Renumbered from `0017`)
- 2025-04-04: Edited (Added chronological status)

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

- Advantages:

  - No microservice needed:
    - No additional infrastructure
    - No interoperability issues between two services: Functions/methods can be adapted more easily when the data structure changes (e.g. name of a variable or adding/removing variables)
  - We would use the same language as in our application.

- Disadvantages:
  - The code base is already very large and will become even larger in the future (e.g. with TGA - Teilgenerischer Ansatz), and the xml generation requires a lot of additional code:
    - The Typescript classes of the XSD schemas
    - New methods and (zod) schemas
    - More complexity in testing
    - We will have to maintain at least two different XJustiz versions at the same time for interoperability.
  - If the XJustiz version changes:
    - it may be difficult to find the changes
    - manual adjustments required

### (3) Generating Java objects from the XSD & generating XML in a separate Java microservice.

Instead of doing it in our main TypeScript app, we can also spin up a microservice in Java.
Java has powerful, mature libraries like `jaxb` that can do both tasks for us.
That would need a new service with according interface in our cluster which entails deployment and maintenance effort.
Also, we create two very distinct places to handle business logic.

- Advantages:

  - A well-maintained library
  - could be used as a microservice:
    - XJustiz versioning would be easier because it can be done with less manual customisation.
    - Adds less complexity to the current code base
    - KomPla could also use the service in the future.
    - No need for new functions/methods to implement types like selections as they are part of the library
      - Tests for those new methods/functions are not needed as they are part of the library.
    - Tests to check if a message is a valid XJustiz message are not needed as this is part of the library
    - Clear separation of services (user flow, xml generation, sending data with FITKO)
    - With FITKO Java is already part of our project
    - Once we send the xml, changes to the user data will probably occur very rarely (we can only send data that is reflected in the xsd, and the xsd is [in theory] a representation of the required data).

- Disadvantages:
  - Microservice can be an overhead:
    - Requires additional infrastructure
    - If the data structure changes (e.g. name of a variable or adding/removing variables), both services need to be updated and there will be temporal interoperability issues.

## Decision

After consideration, we think that approach (2) is the most suitable for our case.
It is closer to our core application logic than a separate microservice and no new repository and language to maintain. It also avoids potential interoperability issues when the structure of the user data changes.
Also, we do not buy-in a very outdated library.

## Consequences

We will create a new service in our `/services` module for generating xml.
Within that we define the types to be "filled" with data and ultimately generate XML using `fast-xml-parser`.

Upon changes to the schema, we will have to manually adapt the types.
However, we expect this to not happen very often, as the schemas are only updated at most once a year.
