import { happyPathData } from "tests/fixtures/beratungshilfeFormularData";
import type { ArrayConfig } from "~/services/array";
import { getSummaryData } from "~/services/array/getSummaryData";

describe("getSummaryData", () => {
  it("returns undefined when array configuration is missing", () => {
    const summaryData = getSummaryData([], undefined, happyPathData);
    expect(summaryData).toBeUndefined();
  });

  it("returns correct configuration when only one category is given", () => {
    const mockArrayConfig = {
      bankkonten: {
        url: "/beratungshilfe/antrag/finanzielle-angaben/eigentum-zusammenfassung/bankkonten",
        initialInputUrl: "daten",
        statementUrl:
          "/beratungshilfe/antrag/finanzielle-angaben/eigentum/bankkonten-frage",
        statementKey: "hasBankkonto",
        event: "add-bankkonten",
      },
    } satisfies Record<string, ArrayConfig>;

    const mockUserData = { ...happyPathData, hasBankkonto: "yes" };

    const actual = getSummaryData(
      ["bankkonten"],
      mockArrayConfig,
      mockUserData,
    );
    const expected = {
      bankkonten: {
        data: [],
        arrayConfiguration: {
          ...mockArrayConfig["bankkonten"],
          statementValue: true,
        },
      },
    };

    expect(actual).toEqual(expected);
  });

  it("returns correct configuration when multiple categories are given", () => {
    const mockArrayConfig = {
      bankkonten: {
        url: "/beratungshilfe/antrag/finanzielle-angaben/eigentum-zusammenfassung/bankkonten",
        initialInputUrl: "daten",
        statementUrl:
          "/beratungshilfe/antrag/finanzielle-angaben/eigentum/bankkonten-frage",
        statementKey: "hasBankkonto",
        event: "add-bankkonten",
      },
      kraftfahrzeuge: {
        url: "/beratungshilfe/antrag/finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge",
        initialInputUrl: "daten",
        statementUrl:
          "/beratungshilfe/antrag/finanzielle-angaben/eigentum/kraftfahrzeuge-frage",
        statementKey: "hasKraftfahrzeug",
        event: "add-kraftfahrzeuge",
      },
    } satisfies Record<string, ArrayConfig>;

    const mockUserData = { ...happyPathData, hasBankkonto: "yes" };

    const actual = getSummaryData(
      ["bankkonten", "kraftfahrzeuge"],
      mockArrayConfig,
      mockUserData,
    );
    const expected = {
      bankkonten: {
        data: [],
        arrayConfiguration: {
          ...mockArrayConfig["bankkonten"],
          statementValue: true,
        },
      },
      kraftfahrzeuge: {
        data: [],
        arrayConfiguration: {
          ...mockArrayConfig["kraftfahrzeuge"],
          statementValue: false,
        },
      },
    };

    expect(actual).toEqual(expected);
  });

  it("should not return the config when category is unknown", () => {
    const mockArrayConfig = {
      bankkonten: {
        url: "/beratungshilfe/antrag/finanzielle-angaben/eigentum-zusammenfassung/bankkonten",
        event: "add-bankkonten",
        initialInputUrl: "daten",
        statementUrl:
          "/beratungshilfe/antrag/finanzielle-angaben/eigentum/bankkonten-frage",
        statementKey: "hasBankkonto",
      },
    } satisfies Record<string, ArrayConfig>;

    const mockUserData = { ...happyPathData, hasBankkonto: "yes" };

    const actual = getSummaryData(
      ["bankkonten", "random"],
      mockArrayConfig,
      mockUserData,
    );
    const expected = {
      bankkonten: {
        data: [],
        arrayConfiguration: {
          ...mockArrayConfig["bankkonten"],
          statementValue: true,
        },
      },
    };

    expect(actual).toEqual(expected);
  });
});
