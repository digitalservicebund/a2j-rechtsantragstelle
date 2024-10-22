import { getSummaryData } from "~/services/array/getSummaryData";

describe("getSummaryData", () => {
  it("returns undefined when array configuration is missing", () => {
    const summaryData = getSummaryData([], undefined, {});
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
      getSummaryData(
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
      getSummaryData(
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
