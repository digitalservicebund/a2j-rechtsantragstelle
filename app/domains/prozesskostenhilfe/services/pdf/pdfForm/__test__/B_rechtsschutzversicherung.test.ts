import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import {
  fillOrgCoverage,
  fillRechtsschutzversicherung,
  fillRSVCoverage,
} from "../B_rechtsschutzversicherung";

let pdfParams: ProzesskostenhilfePDF;

const testCases: Array<
  [
    ProzesskostenhilfeFormularUserData,
    {
      [val in keyof Partial<ProzesskostenhilfePDF>]: {
        value?: boolean | string;
      };
    },
  ]
> = [
  [
    { hasRsv: "no", hasRsvThroughOrg: "no" },
    { b1: { value: true }, b3: { value: true } },
  ],
  [
    { hasRsv: "yes", hasRsvCoverage: "partly" },
    {
      b2: { value: true },
      hoehederKosten: {
        value: "RSV: Teilweise Kostenübernahme (siehe Belege)",
      },
    },
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "partly",
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "partly",
    },
    {
      b2: { value: true },
      hoehederKosten: {
        value:
          "RSV: Teilweise Kostenübernahme (siehe Belege), Verein/Organisation: Teilweise Kostenübernahme (siehe Belege)",
      },
    },
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "partly",
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "no",
    },
    {
      b2: { value: true },
      hoehederKosten: {
        value:
          "RSV: Teilweise Kostenübernahme (siehe Belege), Verein/Organisation: Nein",
      },
      b4: { value: true },
      bezeichnungderVersicherung: {
        value: "Verein/Organisation: Ja (siehe Belege)",
      },
    },
  ],
  [
    { hasRsv: "yes", hasRsvCoverage: "no" },
    {
      b1: { value: true },
      b4: { value: true },
      hoehederKosten: {
        value: "RSV: Nein",
      },
      bezeichnungderVersicherung: {
        value: "RSV: Ja (siehe Belege)",
      },
    },
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "no",
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "partly",
    },
    {
      b1: { value: undefined },
      b2: { value: true },
      b4: { value: true },
      hoehederKosten: {
        value:
          "RSV: Nein, Verein/Organisation: Teilweise Kostenübernahme (siehe Belege)",
      },
      bezeichnungderVersicherung: {
        value: "RSV: Ja (siehe Belege)",
      },
    },
  ],
  [
    {
      hasRsv: "yes",
      hasRsvCoverage: "no",
      hasRsvThroughOrg: "yes",
      hasOrgCoverage: "no",
    },
    {
      b1: { value: true },
      b4: { value: true },
      hoehederKosten: {
        value: "RSV: Nein, Verein/Organisation: Nein",
      },
      bezeichnungderVersicherung: {
        value: "RSV: Ja (siehe Belege), Verein/Organisation: Ja (siehe Belege)",
      },
    },
  ],
  [
    { hasRsvThroughOrg: "yes", hasOrgCoverage: "partly" },
    {
      b1: { value: undefined },
      b2: { value: true },
      hoehederKosten: {
        value: "Verein/Organisation: Teilweise Kostenübernahme (siehe Belege)",
      },
    },
  ],
  [
    { hasRsvThroughOrg: "yes", hasOrgCoverage: "no" },
    {
      b1: { value: true },
      b4: { value: true },
      hoehederKosten: {
        value: "Verein/Organisation: Nein",
      },
      bezeichnungderVersicherung: {
        value: "Verein/Organisation: Ja (siehe Belege)",
      },
    },
  ],
];

describe("B_rechtsschutzversicherung", () => {
  beforeEach(() => {
    pdfParams = getProzesskostenhilfeParameters();
  });

  describe("fillRechtsschutzversicherung", () => {
    it("should indicate if the user has neither RSV nor org coverage", () => {
      const { pdfValues } = fillRechtsschutzversicherung({
        pdfValues: pdfParams,
        userData: {
          hasRsv: "no",
          hasRsvThroughOrg: "no",
        },
      });
      expect(pdfValues.b1.value).toBe(true);
      expect(pdfValues.b3.value).toBe(true);
    });

    it("should indicate if the user has partial RSV coverage", () => {
      const { pdfValues } = fillRechtsschutzversicherung({
        pdfValues: pdfParams,
        userData: {
          hasRsv: "yes",
          hasRsvCoverage: "partly",
        },
      });
      expect(pdfValues.b2.value).toBe(true);
      expect(pdfValues.hoehederKosten.value).toBe(
        "RSV: Teilweise Kostenübernahme (siehe Belege)",
      );
    });

    it("should indicate if the user has no RSV coverage", () => {
      const { pdfValues } = fillRechtsschutzversicherung({
        pdfValues: pdfParams,
        userData: {
          hasRsv: "yes",
          hasRsvCoverage: "no",
        },
      });
      expect(pdfValues.b1.value).toBe(true);
      expect(pdfValues.b4.value).toBe(true);
      expect(pdfValues.bezeichnungderVersicherung.value).toBe(
        "RSV: Ja (siehe Belege)",
      );
    });

    it("should indicate if the user has partial Org coverage", () => {
      const { pdfValues } = fillRechtsschutzversicherung({
        pdfValues: pdfParams,
        userData: {
          hasRsvThroughOrg: "yes",
          hasOrgCoverage: "partly",
        },
      });
      expect(pdfValues.b2.value).toBe(true);
      expect(pdfValues.hoehederKosten.value).toBe(
        "Verein/Organisation: Teilweise Kostenübernahme (siehe Belege)",
      );
    });

    it("should indicate if the user has no Org coverage", () => {
      const { pdfValues } = fillRechtsschutzversicherung({
        pdfValues: pdfParams,
        userData: {
          hasRsvThroughOrg: "yes",
          hasOrgCoverage: "no",
        },
      });
      expect(pdfValues.b1.value).toBe(true);
      expect(pdfValues.b4.value).toBe(true);
      expect(pdfValues.bezeichnungderVersicherung.value).toBe(
        "Verein/Organisation: Ja (siehe Belege)",
      );
    });

    it.each(testCases)(`Given %o, should return %o`, (userData, expected) => {
      const { pdfValues } = fillRechtsschutzversicherung({
        pdfValues: pdfParams,
        userData,
      });
      Object.entries(expected).forEach(([key, value]) => {
        expect(pdfValues[key as keyof ProzesskostenhilfePDF].value).toBe(
          value.value,
        );
      });
    });
  });

  describe("fillRSVCoverage", () => {
    it("should indicate if a user has partial RSV coverage", () => {
      const { pdfValues, field1Text } = fillRSVCoverage({
        pdfValues: pdfParams,
        userData: {
          hasRsv: "yes",
          hasRsvCoverage: "partly",
        },
        field1Text: "",
        field2Text: "",
      });
      expect(pdfValues.b2.value).toBe(true);
      expect(field1Text).toBe("RSV: Teilweise Kostenübernahme (siehe Belege)");
    });

    it("should indicate if a user has RSV with no coverage", () => {
      const { pdfValues, field1Text, field2Text } = fillRSVCoverage({
        pdfValues: pdfParams,
        userData: {
          hasRsv: "yes",
          hasRsvCoverage: "no",
        },
        field1Text: "",
        field2Text: "",
      });
      expect(pdfValues.b1.value).toBe(true);
      expect(field1Text).toBe("RSV: Nein");
      expect(field2Text).toBe("RSV: Ja (siehe Belege)");
    });
  });

  describe("fillOrgCoverage", () => {
    it("should indicate if a user has partial Org coverage", () => {
      const { pdfValues, field1Text } = fillOrgCoverage({
        pdfValues: pdfParams,
        userData: {
          hasRsvThroughOrg: "yes",
          hasOrgCoverage: "partly",
        },
        field1Text: "",
        field2Text: "",
      });
      expect(pdfValues.b2.value).toBe(true);
      expect(pdfValues.b1.value).toBe(undefined);
      expect(field1Text).toBe(
        "Verein/Organisation: Teilweise Kostenübernahme (siehe Belege)",
      );
    });

    it("should indicate if a user has Org with no coverage", () => {
      const { pdfValues, field1Text, field2Text } = fillOrgCoverage({
        pdfValues: pdfParams,
        userData: {
          hasRsvThroughOrg: "yes",
          hasOrgCoverage: "no",
        },
        field1Text: "",
        field2Text: "",
      });
      expect(pdfValues.b1.value).toBe(true);
      expect(field1Text).toBe("Verein/Organisation: Nein");
      expect(pdfValues.b4.value).toBe(true);
      expect(field2Text).toBe("Verein/Organisation: Ja (siehe Belege)");
    });

    it("should append a comma to text field values if they are not empty", () => {
      const { field1Text } = fillOrgCoverage({
        pdfValues: pdfParams,
        userData: {
          hasRsvThroughOrg: "yes",
          hasOrgCoverage: "partly",
        },
        field1Text: "Test1",
        field2Text: "",
      });
      expect(field1Text).toBe(
        "Test1, Verein/Organisation: Teilweise Kostenübernahme (siehe Belege)",
      );
      const { field1Text: field1TextOverwrite, field2Text } = fillOrgCoverage({
        pdfValues: pdfParams,
        userData: {
          hasRsvThroughOrg: "yes",
          hasOrgCoverage: "no",
        },
        field1Text: "Test1",
        field2Text: "Test2",
      });
      expect(field1TextOverwrite).toBe("Test1, Verein/Organisation: Nein");
      expect(field2Text).toBe("Test2, Verein/Organisation: Ja (siehe Belege)");
    });
  });
});
