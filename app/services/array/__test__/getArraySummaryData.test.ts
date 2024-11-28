import { getArraySummaryData } from "~/services/array/getArraySummaryData";

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
});
