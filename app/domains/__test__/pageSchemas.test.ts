import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  getPageSchema,
  getAllFieldsFromFlowId,
  getReadOnlyFields,
} from "../pageSchemas";

describe("getPageSchema", () => {
  it("should return the page schema for the current step", () => {
    expect(
      getPageSchema("/beratungshilfe/vorabcheck/rechtsschutzversicherung"),
    ).toStrictEqual({ rechtsschutzversicherung: YesNoAnswer });
  });

  it("should return undefined if no page schema is found", () => {
    expect(getPageSchema("/step-does-not-exist")).toBeUndefined();
  });

  describe("array pages", () => {
    it("should handle simple array pages", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahme/0/daten",
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("einnahmen#beschreibung");
      expect(result).toHaveProperty("einnahmen#betrag");
    });

    it("should handle different array indexes", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahme/5/daten",
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty("einnahmen#beschreibung");
      expect(result).toHaveProperty("einnahmen#betrag");
    });

    it("should return undefined for non-existent array pages", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahme/0/non-existent",
      );
      expect(result).toBeUndefined();
    });

    it("should return undefined for non-existent nested array pages", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/finanzielle-angaben/eigentum-zusammenfassung/geldanlagen/0/non-existent",
      );
      expect(result).toBeUndefined();
    });

    it("should return undefined for pages without arrayPages", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/simple-page/0/field",
      );
      expect(result).toBeUndefined();
    });

    it("should handle multiple array indexes in the path", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahme/0/daten/1/subfield",
      );
      expect(result).toBeUndefined(); // This should return undefined as it's not a valid path structure
    });
    it("should return undefined for invalid nested path structure", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/finanzielle-angaben/eigentum-zusammenfassung/invalid/0/art",
      );
      expect(result).toBeUndefined();
    });
  });

  describe("edge cases", () => {
    it("should handle empty pathname", () => {
      expect(getPageSchema("")).toBeUndefined();
    });

    it("should handle pathname with only flow ID", () => {
      expect(getPageSchema("/prozesskostenhilfe/formular")).toBeUndefined();
    });

    it("returns undefined for a pathname with multiple consecutive slashes", () => {
      expect(
        getPageSchema(
          "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahme//0//daten",
        ),
      ).toBeUndefined();
    });

    it("should handle pathname with only slashes", () => {
      expect(getPageSchema("///")).toBeUndefined();
    });

    it("should handle pathname with mixed valid and invalid parts", () => {
      const result = getPageSchema(
        "/prozesskostenhilfe/formular/antragstellende-person/vereinfachte-erklaerung/einnahmen/einnahme/0/daten/invalid",
      );
      expect(result).toBeUndefined();
    });
  });
});

describe("getAllFieldsFromFlowId", () => {
  it("should return specific the fields for the page /rechtsschutzversicherung for the flow id /beratungshilfe/vorabcheck", () => {
    const fields = getAllFieldsFromFlowId("/beratungshilfe/vorabcheck");

    expect(fields["/rechtsschutzversicherung"]).toEqual([
      "rechtsschutzversicherung",
    ]);
  });

  it("should return specific the fields for array pages in the flow id /beratungshilfe/antrag", () => {
    const fields = getAllFieldsFromFlowId("/beratungshilfe/antrag");

    expect(fields["/finanzielle-angaben/kinder/kinder/#/name"]).toEqual([
      "kinder#vorname",
      "kinder#nachname",
      "kinder#geburtsdatum",
    ]);
  });

  it("should not return specific array pages without schema in the flow id /beratungshilfe/antrag", () => {
    const fields = getAllFieldsFromFlowId("/beratungshilfe/antrag");

    expect(fields).not.toHaveProperty(
      "/finanzielle-angaben/kinder/kinder/kind-unterhalt-ende",
    );
  });
});

describe("getReadOnlyFields", () => {
  it("should return undefined if there are no readOnlyFields defined for the page", () => {
    const actual = getReadOnlyFields(
      "/beratungshilfe/vorabcheck/rechtsschutzversicherung",
    );

    expect(actual).not.toBeDefined();
  });

  it("should return the readOnlyFields for the page if they are defined", () => {
    const actual = getReadOnlyFields(
      "/geld-einklagen/formular/klage-erstellen/klagende-person/kontaktdaten",
    );

    expect(actual).toBeDefined();
    expect(actual?.fieldNames).toEqual([
      "klagendePersonPlz",
      "klagendePersonOrt",
    ]);
    expect(actual?.shouldMakeReadOnly).toEqual(expect.any(Function));
  });
});
