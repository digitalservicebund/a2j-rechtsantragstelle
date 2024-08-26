import { getPaths } from "../getPaths";

describe("getPaths", () => {
  it("returns base path with steps", () => {
    expect(
      getPaths(
        { rechtsschutzversicherung: "no", wurdeVerklagt: "no" },
        "/beratungshilfe/antrag",
      ),
    ).toStrictEqual([
      {
        stepIds: [
          "start/start",
          "grundvoraussetzungen/start",
          "grundvoraussetzungen/rechtsschutzversicherung",
          "grundvoraussetzungen/wurde-verklagt",
          "grundvoraussetzungen/klage-eingereicht",
          "grundvoraussetzungen/klage-eingereicht-hinweis",
        ],
      },
    ]);
  });

  it("omits steps the user has not seen in base path", () => {
    expect(
      getPaths(
        {
          rechtsschutzversicherung: "no",
          wurdeVerklagt: "no",
          anwaltskanzlei: "no",
        },
        "/beratungshilfe/antrag",
      ),
    ).toStrictEqual([
      {
        stepIds: [
          "start/start",
          "grundvoraussetzungen/start",
          "grundvoraussetzungen/rechtsschutzversicherung",
          "grundvoraussetzungen/wurde-verklagt",
          "grundvoraussetzungen/klage-eingereicht",
          "grundvoraussetzungen/klage-eingereicht-hinweis",
        ],
      },
    ]);
  });

  it("includes path for subflow", () => {
    expect(
      getPaths(
        {
          hasBankkonto: "yes",
          bankkonten: [
            {
              kontoEigentuemer: "myself",
              bankName: "FooBank",
              kontostand: "199,00",
              iban: "",
              kontoDescription: "private Account",
            },
          ],
        },
        "/beratungshilfe/antrag",
      ),
    ).toStrictEqual([
      {
        stepIds: [
          "start/start",
          "grundvoraussetzungen/start",
          "grundvoraussetzungen/rechtsschutzversicherung",
          "grundvoraussetzungen/rechtsschutzversicherung-hinweis",
        ],
      },
      {
        stepIds: [
          "finanzielle-angaben/eigentum-zusammenfassung/bankkonten/daten",
        ],
        arrayIndex: 0,
      },
    ]);
  });

  it("includes multiple paths for subflows", () => {
    expect(
      getPaths(
        {
          hasBankkonto: "yes",
          bankkonten: [
            {
              kontoEigentuemer: "myself",
              bankName: "FooBank",
              kontostand: "199,00",
              iban: "",
              kontoDescription: "private Account",
            },
            {
              kontoEigentuemer: "myself",
              bankName: "BarBank",
              kontostand: "199,00",
              iban: "",
              kontoDescription: "private Account",
            },
          ],
        },
        "/beratungshilfe/antrag",
      ),
    ).toStrictEqual([
      {
        stepIds: [
          "start/start",
          "grundvoraussetzungen/start",
          "grundvoraussetzungen/rechtsschutzversicherung",
          "grundvoraussetzungen/rechtsschutzversicherung-hinweis",
        ],
      },
      {
        stepIds: [
          "finanzielle-angaben/eigentum-zusammenfassung/bankkonten/daten",
        ],
        arrayIndex: 0,
      },
      {
        stepIds: [
          "finanzielle-angaben/eigentum-zusammenfassung/bankkonten/daten",
        ],
        arrayIndex: 1,
      },
    ]);
  });

  it("excludes path for subflow if statement key not 'yes'", () => {
    expect(
      getPaths(
        {
          hasBankkonto: "no",
          bankkonten: [
            {
              kontoEigentuemer: "myself",
              bankName: "FooBank",
              kontostand: "199,00",
              iban: "",
              kontoDescription: "private Account",
            },
          ],
        },
        "/beratungshilfe/antrag",
      ),
    ).toStrictEqual([
      {
        stepIds: [
          "start/start",
          "grundvoraussetzungen/start",
          "grundvoraussetzungen/rechtsschutzversicherung",
          "grundvoraussetzungen/rechtsschutzversicherung-hinweis",
        ],
      },
    ]);
  });

  it("excludes path for subflow if no user data but statement key 'yes'", () => {
    expect(
      getPaths(
        {
          hasBankkonto: "yes",
        },
        "/beratungshilfe/antrag",
      ),
    ).toStrictEqual([
      {
        stepIds: [
          "start/start",
          "grundvoraussetzungen/start",
          "grundvoraussetzungen/rechtsschutzversicherung",
          "grundvoraussetzungen/rechtsschutzversicherung-hinweis",
        ],
      },
    ]);
  });
});
