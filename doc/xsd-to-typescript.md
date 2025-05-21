### How to generate TypeScript type declarations from xJustiz XSD's

In order to have type safety when generating an xJustiz XML at the end of an Antrag, we need to occasionally generate TypeScript type declarations from xJustiz XSD files.
**NOTE: the XSD files can be found at https://xjustiz.justiz.de/, and are not checked into the repository. You will need to download them and place them at `data/xml/schemas` to run the following script:**
Simply run `npm run build:typesFromXSD`. This manual command has you download and run `@wikipathways/cxsd`. We haven't added it as a dependency to our project, as it's several years out-of-date, and the generation shouldn't happen often.

- The generated TS files can be found at `data/xml/generated`, and due to issues with the underlying library, will need to have their imports renamed/fixed.
- You will also need to remove "junk" files, like `din-spec-XXX`, which aren't used.
