import Mustache from "mustache";

const mockTemplate = `
{{#hasBetween7And13DaysAnkuendigung}}
Start: {{#hasErsatzflugLandenZweiStunden}}>2h earlier{{/hasErsatzflugLandenZweiStunden}}{{^hasErsatzflugLandenZweiStunden}}<2h earlier{{/hasErsatzflugLandenZweiStunden}}
Arrival: {{#hasErsatzflugLandenVierStunden}}>4h later{{/hasErsatzflugLandenVierStunden}}{{^hasErsatzflugLandenVierStunden}}<4h later{{/hasErsatzflugLandenVierStunden}}
{{/hasBetween7And13DaysAnkuendigung}}
{{^hasBetween7And13DaysAnkuendigung}}
Start: {{#hasErsatzflugStartenEinStunde}}>1h earlier{{/hasErsatzflugStartenEinStunde}}{{^hasErsatzflugStartenEinStunde}}<1h earlier{{/hasErsatzflugStartenEinStunde}}
Arrival: {{#hasErsatzflugLandenZweiStunden}}>2h later{{/hasErsatzflugLandenZweiStunden}}{{^hasErsatzflugLandenZweiStunden}}<2h later{{/hasErsatzflugLandenZweiStunden}}
{{/hasBetween7And13DaysAnkuendigung}}
`;

const normalizeWhitespace = (str: string) => str.trim().replace(/\s+/g, " ");

describe("getAnnullierungInfo Render", () => {
  const testCases = [
    {
      description: "between 7 and 13 days with specific conditions",
      stringReplacements: {
        hasBetween7And13DaysAnkuendigung: true,
        hasErsatzflugLandenZweiStunden: true,
        hasErsatzflugLandenVierStunden: false,
      },
      expected: "Start: >2h earlier Arrival: <4h later",
    },
    {
      description: "less than 7 or more than 13 days with specific conditions",
      stringReplacements: {
        hasBetween7And13DaysAnkuendigung: false,
        hasErsatzflugStartenEinStunde: false,
        hasErsatzflugLandenZweiStunden: true,
      },
      expected: "Start: <1h earlier Arrival: >2h later",
    },
    {
      description: "between 7 and 13 days with all false conditions",
      stringReplacements: {
        hasBetween7And13DaysAnkuendigung: true,
        hasErsatzflugLandenZweiStunden: false,
        hasErsatzflugLandenVierStunden: false,
      },
      expected: "Start: <2h earlier Arrival: <4h later",
    },
    {
      description: "less than 7 or more than 13 days with all false conditions",
      stringReplacements: {
        hasBetween7And13DaysAnkuendigung: false,
        hasErsatzflugStartenEinStunde: false,
        hasErsatzflugLandenZweiStunden: false,
      },
      expected: "Start: <1h earlier Arrival: <2h later",
    },
  ];

  testCases.forEach(({ description, stringReplacements, expected }) => {
    it(`should render correct output for ${description}`, () => {
      const output = Mustache.render(mockTemplate, stringReplacements);
      expect(normalizeWhitespace(output)).toBe(expected);
    });
  });
});
