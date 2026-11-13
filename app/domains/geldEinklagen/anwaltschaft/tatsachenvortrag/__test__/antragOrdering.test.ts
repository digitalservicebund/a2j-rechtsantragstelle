import { getNebenantragTitle, getOrderedAntraege } from "../antragOrdering";
import type { GeldEinklagenAnwaltschaftUserData } from "../../userData";

const forderung = {
  klagende: {},
  beklagte: {},
  zinsbeginn: { day: "", month: "" },
  zinsende: { day: "", month: "" },
};

describe("getOrderedAntraege", () => {
  it("orders all Anträge and numbers only Zahlungs-, Schmerzensgeld- and Sonstige Anträge", () => {
    const userData: GeldEinklagenAnwaltschaftUserData = {
      sonstigeAntraege: [
        { antrag: "Antrag", internesSchlagwort: "Kosten", id: "s1" },
      ],
      versaeumnisurteil: "on",
      videoverhandlung: "no",
      muendlicheVerhandlung: "on",
      schmerzengeldantrag: [
        {
          ...forderung,
          mindestBetrag: "100",
          nebenantraege: [
            {
              schmerzengeldNebenantragArt: "mahnkosten",
              schmerzengeldNebenantragBetrag: "10",
            },
          ],
        },
      ],
      hauptantrag: [
        { ...forderung, betragForderung: "100", id: "z1" },
        {
          ...forderung,
          betragForderung: "100",
          internesSchlagwortForderung: "Miete",
          nebenantraege: [
            {
              type: "annahmeverzug",
              annahmeverzugsFeststellung: "on",
              annahmeverzugDatum: { day: "", month: "" },
            },
          ],
        },
      ],
    };

    expect(
      getOrderedAntraege(userData).map(
        ({ key, antragId, kind, title, isNebenantrag }) => ({
          key,
          antragId,
          kind,
          title,
          isNebenantrag,
        }),
      ),
    ).toEqual([
      {
        key: "hauptantrag.0",
        antragId: "z1",
        kind: "zahlungsantrag",
        title: "Bezifferter Zahlungsantrag 1",
        isNebenantrag: false,
      },
      {
        key: "hauptantrag.1",
        antragId: undefined,
        kind: "zahlungsantrag",
        title: "Bezifferter Zahlungsantrag 2 (Miete)",
        isNebenantrag: false,
      },
      {
        key: "hauptantrag.1.nebenantraege.0",
        antragId: undefined,
        kind: "nebenantrag",
        title: "Feststellungsantrag zu Antrag 2 - Annahmeverzug",
        isNebenantrag: true,
      },
      {
        key: "schmerzengeldantrag.0",
        antragId: undefined,
        kind: "schmerzensgeldantrag",
        title: "Unbezifferter Schmerzensgeldantrag 3",
        isNebenantrag: false,
      },
      {
        key: "schmerzengeldantrag.0.nebenantraege.0",
        antragId: undefined,
        kind: "nebenantrag",
        title: "Nebenantrag zu Antrag 3 - Mahnkosten",
        isNebenantrag: true,
      },
      {
        key: "sonstigeAntraege.0",
        antragId: "s1",
        kind: "sonstigerAntrag",
        title: "Sonstiger Antrag oder Ausführung 4 (Kosten)",
        isNebenantrag: false,
      },
      {
        key: "muendlicheVerhandlung",
        antragId: "muendlicheVerhandlung",
        kind: "prozessantrag",
        title: "Prozessantrag – Mündliche Verhandlung",
        isNebenantrag: false,
      },
      {
        key: "bedenkenVideoverhandlung",
        antragId: "bedenkenVideoverhandlung",
        kind: "prozessantrag",
        title: "Prozessuale Ausführung – Bedenken gegen Videoverhandlung",
        isNebenantrag: false,
      },
      {
        key: "versaeumnisurteil",
        antragId: "versaeumnisurteil",
        kind: "prozessantrag",
        title: "Prozessantrag – Versäumnisurteil",
        isNebenantrag: false,
      },
    ]);
  });

  it.each([
    [{ videoverhandlung: "yes" }, ["videoverhandlung"]],
    [{ videoverhandlung: "noSpecification" }, []],
    [{ muendlicheVerhandlung: "off", versaeumnisurteil: "off" }, []],
  ] as const)("derives Prozessanträge from %o", (userData, expected) => {
    expect(getOrderedAntraege(userData).map(({ key }) => key)).toEqual(
      expected,
    );
  });
});

describe("getNebenantragTitle", () => {
  it("formats a Schmerzensgeld-Nebenantrag using its own art field", () => {
    expect(
      getNebenantragTitle(
        {
          schmerzengeldNebenantragArt: "ruecklastschriftgebühren",
          schmerzengeldNebenantragBetrag: "10",
        },
        1,
      ),
    ).toBe("Nebenantrag zu Antrag 1 - Rücklastschriftgebühren");
  });
});
