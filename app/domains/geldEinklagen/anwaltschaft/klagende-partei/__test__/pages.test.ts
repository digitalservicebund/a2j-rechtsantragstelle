import omit from "lodash/omit";
import { z } from "zod";
import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { geldEinklagenAnwaltschaftFlowConfig } from "../../flowConfig";
import {
  MAX_REPRESENTATIVES,
  naturalPersonSchema,
  organizationSchema,
} from "../../shared/anwaltschaftSchemas";
import { klagendeParteiPages } from "../pages";

const naturalPerson = {
  anrede: "frau",
  titel: "",
  vorname: "Erika",
  nachname: "Musterfrau",
  strasse: "Musterstraße",
  hausnummer: "1",
  plz: "12345",
  ort: "Musterstadt",
  land: "Deutschland",
  parteiverhaeltnis: "klagende",
  type: "natuerliche-person",
} as const;

const representative = {
  anrede: "herr",
  titel: "",
  vorname: "Max",
  nachname: "Mustermann",
  strasse: "Beispielstraße",
  hausnummer: "2",
  plz: "54321",
  ort: "Beispielstadt",
  land: "Deutschland",
  art: "elternteil",
} as const;

const overviewData = (klagenden: Array<Record<string, unknown>>) => {
  const userData = { klagenden, pageData: { arrayIndexes: [] } };
  return createFlowSession(
    geldEinklagenAnwaltschaftFlowConfig,
    userData,
    klagendeParteiPages.klagendeUebersicht.stepId,
  ).prunedUserData;
};

describe("klagendeParteiPages", () => {
  it.each([0, MAX_REPRESENTATIVES])(
    "accepts a natural person with %i representatives",
    (count) => {
      expect(
        naturalPersonSchema.safeParse({
          ...naturalPerson,
          "gesetzliche-vertretung": Array.from(
            { length: count },
            () => representative,
          ),
        }).success,
      ).toBe(true);
    },
  );

  it("accepts a natural person without a representative array", () => {
    expect(naturalPersonSchema.safeParse(naturalPerson).success).toBe(true);
  });

  it("rejects more than five representatives for a natural person", () => {
    expect(
      naturalPersonSchema.safeParse({
        ...naturalPerson,
        "gesetzliche-vertretung": Array.from(
          { length: MAX_REPRESENTATIVES + 1 },
          () => representative,
        ),
      }).success,
    ).toBe(false);
  });

  describe("organization representatives", () => {
    const organization = {
      ...omit(naturalPerson, ["anrede", "titel", "vorname", "nachname"]),
      type: "organisation",
      orgName: "Beispiel GmbH",
      orgVertretungArt: "vorstand-vorstaendin",
      orgVertretungAnrede: "herr",
      orgVertretungTitel: "",
      orgVertretungVorname: "Max",
      orgVertretungNachname: "Mustermann",
    };

    it("requires no additional array when the flat representative is present", () => {
      expect(organizationSchema.safeParse(organization).success).toBe(true);
    });

    it.each([0, 1, 6])("accepts %i additional representatives", (count) => {
      expect(
        organizationSchema.safeParse({
          ...organization,
          "gesetzliche-vertretung": Array.from({ length: count }, () => ({
            ...representative,
            art: organization.orgVertretungArt,
          })),
        }).success,
      ).toBe(true);
    });

    it.each([
      "orgVertretungArt",
      "orgVertretungVorname",
      "orgVertretungNachname",
    ])(
      "requires the flat %s even when an additional representative is present",
      (field) => {
        expect(
          organizationSchema.safeParse({
            ...omit(organization, field),
            "gesetzliche-vertretung": [
              {
                ...representative,
                art: organization.orgVertretungArt,
              },
            ],
          }).success,
        ).toBe(false);
      },
    );
  });

  it("retains representatives for each plaintiff on the overview", () => {
    const klagenden = [
      {
        ...naturalPerson,
        "gesetzliche-vertretung": [
          representative,
          { ...representative, vorname: "Maria", art: "vormund-vormundin" },
        ],
      },
      {
        ...naturalPerson,
        vorname: "Anna",
        "gesetzliche-vertretung": [{ ...representative, vorname: "Paul" }],
      },
    ];

    for (const plaintiff of klagenden) {
      expect(naturalPersonSchema.safeParse(plaintiff).success).toBe(true);
    }

    const pruned = overviewData(klagenden);

    expect(pruned).toEqual({
      klagenden: klagenden.map((plaintiff) =>
        omit(plaintiff, "parteiverhaeltnis"),
      ),
    });
  });

  it.each([
    { name: "a missing array", fields: {} },
    {
      name: "an incomplete representative",
      fields: { "gesetzliche-vertretung": [{ art: representative.art }] },
    },
  ])("preserves $name on the overview", ({ fields }) => {
    const plaintiff = { ...naturalPerson, ...fields };

    expect(overviewData([plaintiff])).toEqual({
      klagenden: [omit(plaintiff, "parteiverhaeltnis")],
    });
  });

  it.each([undefined, [], [{ art: representative.art }]])(
    "allows optional and draft representatives on the parent page (%j)",
    (value) => {
      const schema = z.object(
        klagendeParteiPages.klagendeNaturalPersonDaten.pageSchema,
      );
      const candidate = Object.fromEntries(
        Object.entries({
          ...naturalPerson,
          "gesetzliche-vertretung": value,
        }).map(([key, fieldValue]) => [`klagenden#${key}`, fieldValue]),
      );

      expect(schema.safeParse(candidate).success).toBe(true);
    },
  );
});
