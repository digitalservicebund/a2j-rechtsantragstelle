import { describe, it, expect } from "vitest";
import { createArrayEditUrl, expandArrayFields } from "../arrayFieldProcessing";
import type { UserData } from "~/domains/userData";

describe("createArrayEditUrl", () => {
  describe("Beratungshilfe flows", () => {
    it("should handle bankkonten arrays", () => {
      const result = createArrayEditUrl(
        "bankkonten[0].kontostand",
        "/beratungshilfe/antrag/finanzielle-angaben/eigentum/bankkonten/bankkonto/daten",
      );
      expect(result).toBe(
        "/beratungshilfe/antrag/finanzielle-angaben/eigentum/bankkonten/uebersicht",
      );
    });

    it("should handle wertsachen field mapping", () => {
      const result = createArrayEditUrl(
        "wertsachen[0].art",
        "/beratungshilfe/antrag/finanzielle-angaben/eigentum/wertgegenstaende/wertgegenstand/daten",
      );
      expect(result).toBe(
        "/beratungshilfe/antrag/finanzielle-angaben/eigentum/wertgegenstaende/uebersicht",
      );
    });

    it("should handle unterhaltszahlungen contains matching", () => {
      const result = createArrayEditUrl(
        "unterhaltszahlungen[0].firstName",
        "/beratungshilfe/antrag/finanzielle-angaben/andere-unterhaltszahlungen/person/daten",
      );
      expect(result).toBe(
        "/beratungshilfe/antrag/finanzielle-angaben/andere-unterhaltszahlungen/uebersicht",
      );
    });
  });

  it("should return original URL for non-array fields", () => {
    const originalUrl = "/some/regular/field/url";
    const result = createArrayEditUrl("regularField", originalUrl);
    expect(result).toBe(originalUrl);
  });

  it("should handle any properly structured array URL", () => {
    const result = createArrayEditUrl(
      "someArray[0].field",
      "/beratungshilfe/antrag/some-section/collection-name/item-type/action",
    );
    expect(result).toBe(
      "/beratungshilfe/antrag/some-section/collection-name/uebersicht",
    );
  });
});

describe("expandArrayFields", () => {
  const userData: UserData = {
    bankkonten: [
      {
        kontoEigentuemer: "myself",
        bankName: "Test Bank",
        kontostand: "312,00",
      },
    ],
    kinder: [
      {
        vorname: "Kind1",
        nachname: "Test",
        geburtsdatum: "11.11.2009",
        wohnortBeiAntragsteller: "yes",
      },
      {
        vorname: "Kind2",
        nachname: "Test",
        geburtsdatum: "11.11.2010",
        wohnortBeiAntragsteller: "partially",
      },
    ],
  };

  const fieldToStepMapping = {
    "bankkonten#kontoEigentuemer": "/step1",
    "bankkonten#bankName": "/step1",
    "bankkonten#kontostand": "/step1",
    "kinder#vorname": "/step2",
    "kinder#nachname": "/step2",
    "kinder#geburtsdatum": "/step2",
    "kinder#wohnortBeiAntragsteller": "/step2",
  };

  it("should expand bankkonten array fields", () => {
    const result = expandArrayFields(
      ["bankkonten"],
      userData,
      fieldToStepMapping,
    );

    expect(result).toEqual([
      "bankkonten[0].kontoEigentuemer",
      "bankkonten[0].bankName",
      "bankkonten[0].kontostand",
    ]);
  });

  it("should expand kinder array fields", () => {
    const result = expandArrayFields(["kinder"], userData, fieldToStepMapping);

    expect(result).toEqual([
      "kinder[0].vorname",
      "kinder[0].nachname",
      "kinder[0].geburtsdatum",
      "kinder[0].wohnortBeiAntragsteller",
      "kinder[1].vorname",
      "kinder[1].nachname",
      "kinder[1].geburtsdatum",
      "kinder[1].wohnortBeiAntragsteller",
    ]);
  });

  it("should return regular fields unchanged", () => {
    const result = expandArrayFields(
      ["vorname", "nachname"],
      userData,
      fieldToStepMapping,
    );

    expect(result).toEqual(["vorname", "nachname"]);
  });

  it("should handle mixed array and regular fields", () => {
    const result = expandArrayFields(
      ["vorname", "bankkonten", "nachname"],
      userData,
      fieldToStepMapping,
    );

    expect(result).toEqual([
      "vorname",
      "bankkonten[0].kontoEigentuemer",
      "bankkonten[0].bankName",
      "bankkonten[0].kontostand",
      "nachname",
    ]);
  });
});
