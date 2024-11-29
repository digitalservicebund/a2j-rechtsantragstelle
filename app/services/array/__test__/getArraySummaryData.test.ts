import type { ArrayData } from "~/domains/contexts";
import { getArraySummaryData } from "~/services/array/getArraySummaryData";
import type { ArrayConfig } from "..";

describe("getArraySummaryData", () => {
  it("returns undefined when array configuration is missing", () => {
    const summaryData = getArraySummaryData([], undefined, {});
    expect(summaryData).toBeUndefined();
  });

  const bankkontenUrl =
    "/beratungshilfe/antrag/finanzielle-angaben/eigentum-zusammenfassung/bankkonten";
  const addBankkonten = "add-bankkonten";

  const bankkontenArrayConfig = {
    url: bankkontenUrl,
    initialInputUrl: "daten",
    statementKey: "hasBankkonto",
    event: addBankkonten,
  } as const;

  const kfzArrayConfig = {
    url: "/beratungshilfe/antrag/finanzielle-angaben/eigentum-zusammenfassung/kraftfahrzeuge",
    initialInputUrl: "daten",
    statementKey: "hasKraftfahrzeug",
    event: "add-kraftfahrzeuge",
  } as const;

  it("returns array configuration and data", () => {
    expect(
      getArraySummaryData(
        ["bankkonten", "kraftfahrzeuge"],
        { bankkonten: bankkontenArrayConfig, kraftfahrzeuge: kfzArrayConfig },
        {
          hasBankkonto: "yes",
          hasKraftfahrzeug: "yes",
          kraftfahrzeuge: [{ hasArbeitsweg: "no", wert: "under10000" }],
        },
      ),
    ).toEqual({
      bankkonten: {
        data: [],
        arrayConfiguration: bankkontenArrayConfig,
      },
      kraftfahrzeuge: {
        data: [{ hasArbeitsweg: "no", wert: "under10000" }],
        arrayConfiguration: kfzArrayConfig,
      },
    });
  });

  it("filterns non-available & unknown arrays or untrue statements", () => {
    expect(
      getArraySummaryData(
        ["bankkonten", "kraftfahrzeuge", "asdf"],
        {
          bankkonten: {
            url: bankkontenUrl,
            event: addBankkonten,
            initialInputUrl: "daten",
            statementKey: "hasBankkonto",
          },
        },
        { hasBankkonto: "no" },
      ),
    ).toEqual({});
  });

  it("should return disableAddButton false given an undefined function shouldDisableAddButton", () => {
    const actual = getArraySummaryData(
      ["bankkonten"],
      { bankkonten: bankkontenArrayConfig },
      {
        hasBankkonto: "yes",
      },
    );

    expect(
      (
        actual?.["bankkonten"] as {
          data: ArrayData;
          arrayConfiguration: ArrayConfig;
        }
      ).arrayConfiguration.disableAddButton,
    ).toBe(false);
  });

  it("should return disableAddButton false given a function shouldDisableAddButton that it returns false", () => {
    const mockBankkontenArrayConfig = {
      ...bankkontenArrayConfig,
      shouldDisableAddButton: () => false,
    };

    const actual = getArraySummaryData(
      ["bankkonten"],
      { bankkonten: mockBankkontenArrayConfig },
      {
        hasBankkonto: "yes",
      },
    );

    expect(
      (
        actual?.["bankkonten"] as {
          data: ArrayData;
          arrayConfiguration: ArrayConfig;
        }
      ).arrayConfiguration.disableAddButton,
    ).toBe(false);
  });

  it("should return disableAddButton true given a function shouldDisableAddButton that it returns true", () => {
    const mockBankkontenArrayConfig = {
      ...bankkontenArrayConfig,
      shouldDisableAddButton: () => true,
    };

    const actual = getArraySummaryData(
      ["bankkonten"],
      { bankkonten: mockBankkontenArrayConfig },
      {
        hasBankkonto: "yes",
      },
    );

    expect(
      (
        actual?.["bankkonten"] as {
          data: ArrayData;
          arrayConfiguration: ArrayConfig;
        }
      ).arrayConfiguration.disableAddButton,
    ).toBe(true);
  });
});
