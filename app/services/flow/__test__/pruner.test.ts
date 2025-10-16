import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { getStrapiEntry } from "~/services/cms/getStrapiEntry";
import type { StrapiSchemas } from "~/services/cms/schemas";
import { filterFormFields, pruneIrrelevantData } from "../pruner";

vi.mock("~/services/cms/getStrapiEntry");

describe("pruner", () => {
  describe("filterFormFields", () => {
    it("returns form field names", () => {
      const result = filterFormFields(
        { "/step1": ["field1"], "/step2": ["field2"] },
        [{ stepIds: ["/step1", "/step2"] }],
      );

      expect(result).toEqual(["field1", "field2"]);
    });

    it("returns form field names for multiple forms within one flowPage", () => {
      const result = filterFormFields(
        { "/step1": ["field1", "field2", "field3"] },
        [{ stepIds: ["/step1"] }],
      );
      expect(result).toEqual(["field1", "field2", "field3"]);
    });

    it("keeps array index", () => {
      const result = filterFormFields(
        {
          "/step1": ["field1"],
          "/step1a": ["field1#a"],
          "/step2a": ["field2#a"],
          "/step1b": ["field1#b", "field1#b1"],
        },
        [
          { stepIds: ["/step1"] },
          { stepIds: ["/step1a", "/step2a"], arrayIndex: 0 },
          { stepIds: ["/step1b"], arrayIndex: 1 },
        ],
      );

      expect(result).toEqual([
        "field1",
        "field1[0]a",
        "field2[0]a",
        "field1[1]b",
        "field1[1]b1",
      ]);
    });
  });

  describe("pruneIrrelevantData", () => {
    it("prunes irrelevant data", async () => {
      const strapiEntries = [
        {
          stepId: "/start",
          form: [],
        },
        {
          stepId: "/grundvoraussetzungen/rechtsschutzversicherung",
          form: [{ name: "rechtsschutzversicherung" }],
        },
        {
          stepId: "/grundvoraussetzungen/wurde-verklagt",
          form: [{ name: "wurdeVerklagt" }],
        },
        {
          stepId: "/grundvoraussetzungen/klage-eingereicht",
          form: [{ name: "klageEingereicht" }],
        },
        {
          stepId: "/grundvoraussetzungen/beratungshilfe-beantragt",
          form: [{ name: "beratungshilfeBeantragt" }],
        },
        {
          stepId: "/grundvoraussetzungen/eigeninitiative-grundvorraussetzung",
          form: [{ name: "eigeninitiativeGrundvorraussetzung" }],
        },
        {
          stepId: "/finanzielle-angaben/einkommen/staatliche-leistungen",
          form: [{ name: "staatlicheLeistungen" }],
        },
        {
          stepId: "/finanzielle-angaben/eigentum/bankkonten/bankkonten-frage",
          form: [{ name: "hasBankkonto" }],
        },
        {
          stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlagen-frage",
          form: [{ name: "hasGeldanlage" }],
        },
        {
          stepId: "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/art",
          form: [{ name: "geldanlagen#art" }],
        },
        {
          stepId:
            "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/forderung",
          form: [
            { name: "geldanlagen#forderung" },
            { name: "geldanlagen#eigentuemer" },
            { name: "geldanlagen#wert" },
          ],
        },

        {
          stepId:
            "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/befristet",
          form: [
            { name: "geldanlagen#eigentuemer" },
            { name: "geldanlagen#befristetArt" },
            { name: "geldanlagen#verwendungszweck" },
            { name: "geldanlagen#wert" },
            { name: "geldanlagen#auszahlungdatum" },
          ],
        },

        {
          stepId:
            "/finanzielle-angaben/eigentum/geldanlagen/geldanlage/bargeld",
          form: [
            { name: "geldanlagen#eigentuemer" },
            { name: "geldanlagen#wert" },
          ],
        },
        {
          stepId:
            "/finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstaende-frage",
          form: [{ name: "hasWertsache" }],
        },
        {
          stepId:
            "/finanzielle-angaben/eigentum/grundeigentum/grundeigentum-frage",
          form: [{ name: "hasGrundeigentum" }],
        },
        {
          stepId:
            "/finanzielle-angaben/eigentum/kraftfahrzeuge/kraftfahrzeuge-frage",
          form: [{ name: "hasKraftfahrzeug" }],
        },
      ];

      vi.mocked(getStrapiEntry).mockReturnValue(
        Promise.resolve(strapiEntries as StrapiSchemas["form-flow-pages"]),
      );

      const userData = {
        rechtsschutzversicherung: "no",
        wurdeVerklagt: "no",
        klageEingereicht: "no",
        beratungshilfeBeantragt: "no",
        eigeninitiativeGrundvorraussetzung: "no",
        staatlicheLeistungen: "keine",
        hasBankkonto: "no",
        hasGeldanlage: "yes",
        hasWertsache: "no",
        hasGrundeigentum: "no",
        hasKraftfahrzeug: "no",
        bankkonten: [
          { bankName: "asd", kontoEigentuemer: "myself", kontostand: "123" },
        ],
        geldanlagen: [
          {
            art: "befristet",
            eigentuemer: "partner",
            befristetArt: "lifeInsurance",
            verwendungszweck: "123",
            wert: "123",
            auszahlungdatum: "11.11.2032",
          },
          {
            art: "bargeld",
            eigentuemer: "partner",
            befristetArt: "lifeInsurance",
            verwendungszweck: "123",
            wert: "123",
            auszahlungdatum: "11.11.2032",
          },
        ],
        hasKinder: "no",
        kinder: [
          {
            vorname: "a",
            nachname: "b",
            geburtsdatum: "11.11.2023",
            wohnortBeiAntragsteller: "no",
            unterhalt: "yes",
            unterhaltsSumme: "123",
          },
        ],
      } satisfies BeratungshilfeFormularUserData;
      const flowId = "/beratungshilfe/antrag";

      const { prunedData } = await pruneIrrelevantData(userData, flowId);
      expect(prunedData).toStrictEqual({
        rechtsschutzversicherung: "no",
        wurdeVerklagt: "no",
        klageEingereicht: "no",
        beratungshilfeBeantragt: "no",
        eigeninitiativeGrundvorraussetzung: "no",
        staatlicheLeistungen: "keine",
        hasBankkonto: "no",
        hasGeldanlage: "yes",
        hasWertsache: "no",
        hasGrundeigentum: "no",
        hasKraftfahrzeug: "no",
        geldanlagen: [
          {
            art: "befristet",
            eigentuemer: "partner",
            befristetArt: "lifeInsurance",
            verwendungszweck: "123",
            wert: "123",
            auszahlungdatum: "11.11.2032",
          },
          {
            art: "bargeld",
            wert: "123",
            eigentuemer: "partner",
          },
        ],
      });
    });
  });

  it("should return the paths and if the path is an array page given a context and flowId", async () => {
    const strapiEntries = [
      {
        stepId: "/grundvoraussetzungen/rechtsschutzversicherung",
        form: [{ name: "rechtsschutzversicherung" }],
      },
      {
        stepId: "/grundvoraussetzungen/wurde-verklagt",
        form: [{ name: "wurdeVerklagt" }],
      },
      {
        stepId: "/grundvoraussetzungen/klage-eingereicht",
        form: [{ name: "klageEingereicht" }],
      },
      {
        stepId: "/grundvoraussetzungen/beratungshilfe-beantragt",
        form: [{ name: "beratungshilfeBeantragt" }],
      },
      {
        stepId: "/grundvoraussetzungen/eigeninitiative-grundvorraussetzung",
        form: [{ name: "eigeninitiativeGrundvorraussetzung" }],
      },
      {
        stepId: "/finanzielle-angaben/einkommen/staatliche-leistungen",
        form: [{ name: "staatlicheLeistungen" }],
      },
      {
        stepId: "/finanzielle-angaben/kinder/kinder-frage",
        form: [{ name: "hasKinder" }],
      },
      {
        stepId: "/finanzielle-angaben/kinder/kinder/name",
        form: [
          { name: "kinder#vorname" },
          { name: "kinder#nachname" },
          { name: "kinder#geburtsdatum" },
        ],
      },
    ];

    vi.mocked(getStrapiEntry).mockReturnValue(
      Promise.resolve(strapiEntries as StrapiSchemas["form-flow-pages"]),
    );

    const userData = {
      rechtsschutzversicherung: "no",
      wurdeVerklagt: "no",
      klageEingereicht: "no",
      beratungshilfeBeantragt: "no",
      eigeninitiativeGrundvorraussetzung: "no",
      staatlicheLeistungen: "keine",
      hasKinder: "yes",
      kinder: [
        {
          vorname: "a",
          nachname: "b",
          geburtsdatum: "11.11.2023",
          wohnortBeiAntragsteller: "yes",
          eigeneEinnahmen: "yes",
          einnahmen: "100",
        },
      ],
    } satisfies BeratungshilfeFormularUserData;
    const flowId = "/beratungshilfe/antrag";

    const { validFlowPaths } = await pruneIrrelevantData(userData, flowId);

    expect(validFlowPaths).toEqual({
      "/grundvoraussetzungen/klage-eingereicht": {
        isArrayPage: false,
      },
      "/grundvoraussetzungen/rechtsschutzversicherung": {
        isArrayPage: false,
      },
      "/grundvoraussetzungen/wurde-verklagt": {
        isArrayPage: false,
      },
      "/finanzielle-angaben/einkommen/staatliche-leistungen": {
        isArrayPage: false,
      },
      "/finanzielle-angaben/kinder/kinder-frage": {
        isArrayPage: false,
      },
      "/finanzielle-angaben/kinder/kinder/name": {
        isArrayPage: true,
      },
      "/grundvoraussetzungen/beratungshilfe-beantragt": {
        isArrayPage: false,
      },
      "/grundvoraussetzungen/eigeninitiative-grundvorraussetzung": {
        isArrayPage: false,
      },
    });
  });
});
