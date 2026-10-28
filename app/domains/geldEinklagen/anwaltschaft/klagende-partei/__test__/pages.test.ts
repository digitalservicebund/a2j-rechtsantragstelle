import omit from "lodash/omit";
import { z } from "zod";
import { createFlowSession } from "~/services/flow/flowEngine/createFlowSession";
import { geldEinklagenAnwaltschaftFlowConfig } from "../../flowConfig";
import {
  MAX_REPRESENTATIVES,
  naturalPersonSchema,
  organizationSchema,
} from "../../shared/klageParties/klagePartySchemas";
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
  id: crypto.randomUUID(),
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

    it.each([
      { name: "empty", klagenden: [] },
      { name: "person-only", klagenden: [naturalPerson] },
      { name: "organization-only", klagenden: [organization] },
      { name: "mixed", klagenden: [naturalPerson, organization] },
      { name: "untyped draft", klagenden: [{}] },
    ])("allows adding either party type to an $name list", ({ klagenden }) => {
      for (const page of [
        klagendeParteiPages.klagendeNaturalPersonDaten,
        klagendeParteiPages.klagendeOrganizationDaten,
      ]) {
        const userData = {
          klagenden,
          pageData: { arrayIndexes: [klagenden.length] },
        };
        const session = createFlowSession(
          geldEinklagenAnwaltschaftFlowConfig,
          userData,
          page.stepId,
        );

        expect(session.isReachable(page.stepId)).toBe(true);
        expect(session.prevPath).toBe(
          klagendeParteiPages.klagendeUebersicht.stepId,
        );
        expect(session.statusTree["/klagende-partei"]?.isDone).toBe(false);
      }
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

    it.each(["person", "organization", "mixed"])(
      "marks complete %s plaintiffs done without validating the other party type",
      (partyType) => {
        const personWithRepresentative = {
          ...naturalPerson,
          "gesetzliche-vertretung": [representative],
        };
        const organizationWithRepresentative = {
          ...organization,
          "gesetzliche-vertretung": [
            { ...representative, art: organization.orgVertretungArt },
          ],
        };
        const klagenden =
          partyType === "person"
            ? [personWithRepresentative]
            : partyType === "organization"
              ? [organizationWithRepresentative]
              : [personWithRepresentative, organizationWithRepresentative];
        const userData = { klagenden, pageData: { arrayIndexes: [] } };
        const session = createFlowSession(
          geldEinklagenAnwaltschaftFlowConfig,
          userData,
          klagendeParteiPages.klagendeUebersicht.stepId,
        );

        expect(
          session.statusTree["/klagende-partei"]?.children?.["/klagenden"]
            ?.isDone,
        ).toBe(true);
        expect(session.statusTree["/klagende-partei"]?.isDone).toBe(false);
        expect(session.prunedUserData).toEqual({
          klagenden: klagenden.map((plaintiff) =>
            omit(plaintiff, "parteiverhaeltnis"),
          ),
        });
      },
    );

    it.each(["party", "representative"])(
      "keeps mixed plaintiffs incomplete when a %s is unfinished",
      (incomplete) => {
        const userData = {
          klagenden: [
            { ...naturalPerson },
            {
              ...organization,
              orgName: incomplete === "party" ? "" : organization.orgName,
              "gesetzliche-vertretung": [
                {
                  ...representative,
                  art: organization.orgVertretungArt,
                  vorname:
                    incomplete === "representative"
                      ? ""
                      : representative.vorname,
                },
              ],
            },
          ],
          pageData: { arrayIndexes: [] },
        };
        const session = createFlowSession(
          geldEinklagenAnwaltschaftFlowConfig,
          userData,
          klagendeParteiPages.klagendeUebersicht.stepId,
        );

        expect(session.statusTree["/klagende-partei"]?.isDone).toBe(false);
      },
    );

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

  it("preserves party IDs through repeated pruning", () => {
    const partyId = crypto.randomUUID();
    const klagenden = [
      {
        ...naturalPerson,
        id: partyId,
      },
    ];
    const expected = {
      klagenden: [omit(klagenden[0], "parteiverhaeltnis")],
    };

    expect(overviewData(klagenden)).toEqual(expected);
    expect(overviewData(klagenden)).toEqual(expected);
    expect(naturalPersonSchema.safeParse(klagenden[0]).success).toBe(true);
  });

  it.each([undefined, "unknown"])(
    "does not count a party with type %s as complete",
    (type) => {
      const userData = {
        klagenden: [{ ...naturalPerson, type }],
        pageData: { arrayIndexes: [] },
      };
      const session = createFlowSession(
        geldEinklagenAnwaltschaftFlowConfig,
        userData,
        klagendeParteiPages.klagendeUebersicht.stepId,
      );

      expect(session.statusTree["/klagende-partei"]?.isDone).toBe(false);
    },
  );

  it("keeps a new optional representative incomplete while its form is open", () => {
    const userData = {
      klagenden: [naturalPerson],
      pageData: { arrayIndexes: [0, 0] },
    };
    const session = createFlowSession(
      geldEinklagenAnwaltschaftFlowConfig,
      userData,
      klagendeParteiPages.klagendeNaturalPersonGesetzlicheVertretungDaten
        .stepId,
    );

    expect(session.statusTree["/klagende-partei"]?.isDone).toBe(false);
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
