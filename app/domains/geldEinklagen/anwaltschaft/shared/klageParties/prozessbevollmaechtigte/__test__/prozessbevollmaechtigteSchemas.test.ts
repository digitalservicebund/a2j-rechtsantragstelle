import omit from "lodash/omit";
import {
  type KlagendeProzessbevollmaechtigte,
  beklagteProzessbevollmaechtigteArraySchema,
  prozessbevollmaechtigteArraySchema,
} from "../prozessbevollmaechtigteSchemas";
import {
  beklagteGesellschaft,
  beklagteIndividualRepresentatives,
  einzelkanzlei,
  gesellschaft,
} from "./fixtures";
import { MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS } from "../prozessbevollmaechtigteHelpers";

describe("prozessbevollmaechtigte schemas", () => {
  it.each([einzelkanzlei, gesellschaft])(
    "accepts a single entry of either type",
    (item) => {
      expect(prozessbevollmaechtigteArraySchema.parse([item])).toEqual([item]);
    },
  );

  it("accepts no representative", () => {
    expect(prozessbevollmaechtigteArraySchema.parse([])).toEqual([]);
  });

  it.each(["on", "off"] as const)(
    "accepts a company with checkbox value %j",
    (isProzessbevollmaechtigt) => {
      let item: KlagendeProzessbevollmaechtigte[number];
      if (
        isProzessbevollmaechtigt === "off" ||
        isProzessbevollmaechtigt === undefined
      ) {
        item = {
          ...omit(gesellschaft, "signaturangaben"),
          isProzessbevollmaechtigt,
          ["prozessbevollmaechtigte-personen"]: [
            {
              anrede: "",
              titel: "",
              vorname: "Vorname",
              nachname: "Nachname",
              namedInSignature: "off",
              berufsbezeichnung: "",
              telefonnummer: "",
              email: "",
            },
          ],
        };
      } else {
        item = {
          ...gesellschaft,
          isProzessbevollmaechtigt: isProzessbevollmaechtigt,
        };
      }
      expect(prozessbevollmaechtigteArraySchema.parse([item])).toEqual([item]);
    },
  );

  it.each([einzelkanzlei, gesellschaft])(
    "allows contact details and business reference to be omitted",
    (item) => {
      expect(
        prozessbevollmaechtigteArraySchema.safeParse([
          {
            ...item,
            geschaeftszeichen: undefined,
            telefonnummer: undefined,
            email: undefined,
          },
        ]).success,
      ).toBe(true);
    },
  );

  it.each([
    [einzelkanzlei, gesellschaft],
    [einzelkanzlei, einzelkanzlei],
    [gesellschaft, gesellschaft],
  ])("rejects multiple entries regardless of type: %j", (...items) => {
    expect(prozessbevollmaechtigteArraySchema.safeParse(items).success).toBe(
      false,
    );
  });

  it.each([
    { ...einzelkanzlei, vorname: "" },
    { ...gesellschaft, name: "" },
    { ...einzelkanzlei, name: "" },
    { ...gesellschaft, isProzessbevollmaechtigt: "invalid" },
    { ...einzelkanzlei, email: "invalid" },
    { ...gesellschaft, telefonnummer: "invalid" },
    { ...einzelkanzlei, strasse: "" },
    { ...gesellschaft, land: "" },
    { ...einzelkanzlei, type: "natuerliche-person" },
    { ...gesellschaft, type: "organisation" },
  ])("rejects incomplete or wrong-type data: %j", (item) => {
    expect(prozessbevollmaechtigteArraySchema.safeParse([item]).success).toBe(
      false,
    );
  });
});

describe.each([
  {
    relationship: "klagende",
    schema: prozessbevollmaechtigteArraySchema,
    company: gesellschaft,
    personsKey: "signaturangaben",
    person: gesellschaft.signaturangaben[0],
  },
  {
    relationship: "beklagte",
    schema: beklagteProzessbevollmaechtigteArraySchema,
    company: beklagteIndividualRepresentatives,
    personsKey: "prozessbevollmaechtigte-personen",
    person:
      beklagteIndividualRepresentatives["prozessbevollmaechtigte-personen"][0],
  },
  {
    relationship: "klagende without company authorization",
    schema: prozessbevollmaechtigteArraySchema,
    company: {
      ...beklagteIndividualRepresentatives,
      "prozessbevollmaechtigte-personen": [
        {
          ...beklagteIndividualRepresentatives[
            "prozessbevollmaechtigte-personen"
          ][0],
          namedInSignature: "off" as const,
        },
      ],
    },
    personsKey: "prozessbevollmaechtigte-personen",
    person: {
      ...beklagteIndividualRepresentatives[
        "prozessbevollmaechtigte-personen"
      ][0],
      namedInSignature: "off" as const,
    },
  },
])(
  "$relationship representative schemas",
  ({ schema, company, personsKey, person }) => {
    it("accepts the party-specific company without changing its data", () => {
      expect(schema.parse([company])).toEqual([company]);
    });

    it("requires the additional persons array", () => {
      expect(schema.safeParse([omit(company, personsKey)]).success).toBe(false);
    });

    it("requires at least one additional person", () => {
      expect(schema.safeParse([{ ...company, [personsKey]: [] }]).success).toBe(
        false,
      );
    });

    it("accepts the maximum number of additional persons", () => {
      const item = {
        ...company,
        [personsKey]: Array.from(
          { length: MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS },
          () => person,
        ),
      };
      expect(schema.parse([item])).toEqual([item]);
    });

    it("rejects additional persons beyond the maximum", () => {
      expect(
        schema.safeParse([
          {
            ...company,
            [personsKey]: Array.from(
              {
                length: MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS + 1,
              },
              () => person,
            ),
          },
        ]).success,
      ).toBe(false);
    });
  },
);

describe("beklagte representative schemas", () => {
  it("accepts an authorized company without additional persons", () => {
    expect(
      beklagteProzessbevollmaechtigteArraySchema.parse([beklagteGesellschaft]),
    ).toEqual([beklagteGesellschaft]);
  });

  it("strips stale additional persons and signature data from an authorized company", () => {
    expect(
      beklagteProzessbevollmaechtigteArraySchema.parse([
        {
          ...beklagteGesellschaft,
          "prozessbevollmaechtigte-personen":
            beklagteIndividualRepresentatives[
              "prozessbevollmaechtigte-personen"
            ],
          signaturangaben: gesellschaft.signaturangaben,
        },
      ]),
    ).toEqual([beklagteGesellschaft]);
  });

  it("still requires signature data for an authorized klagende company", () => {
    expect(
      prozessbevollmaechtigteArraySchema.safeParse([beklagteGesellschaft])
        .success,
    ).toBe(false);
  });

  it("accepts an Einzelkanzlei unchanged", () => {
    expect(
      beklagteProzessbevollmaechtigteArraySchema.parse([einzelkanzlei]),
    ).toEqual([einzelkanzlei]);
  });

  it("accepts an empty optional array", () => {
    expect(beklagteProzessbevollmaechtigteArraySchema.parse([])).toEqual([]);
  });

  it("requires a salutation for an individual representative", () => {
    expect(
      beklagteProzessbevollmaechtigteArraySchema.safeParse([
        {
          ...beklagteIndividualRepresentatives,
          "prozessbevollmaechtigte-personen": [gesellschaft.signaturangaben[0]],
        },
      ]).success,
    ).toBe(false);
  });

  it("strips signature and contact fields from an individual representative", () => {
    expect(
      beklagteProzessbevollmaechtigteArraySchema.parse([
        {
          ...beklagteIndividualRepresentatives,
          "prozessbevollmaechtigte-personen": [
            {
              ...beklagteIndividualRepresentatives[
                "prozessbevollmaechtigte-personen"
              ][0],
              namedInSignature: "on",
              telefonnummer: "+49 30 123456",
              email: "erika@example.com",
            },
          ],
        },
      ]),
    ).toEqual([beklagteIndividualRepresentatives]);
  });

  it("rejects multiple representatives", () => {
    expect(
      beklagteProzessbevollmaechtigteArraySchema.safeParse([
        einzelkanzlei,
        beklagteGesellschaft,
      ]).success,
    ).toBe(false);
  });
});
