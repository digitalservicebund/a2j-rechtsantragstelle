import { createServer, type Server } from "node:http";
import {
  datatypeC,
  datatypeE,
  ergonomics,
  Gerichte,
  Rollenbezeichnung,
} from "@digitalservicebund/a2j-xjustiz-bridge/nachricht/zahlungsklage";
import { userDataMock } from "~/domains/geldEinklagen/services/pdf/__test__/userDataMock";
import { geldEinklagenXjustizFromUserdata } from "../geldEinklagenXjustizFromUserdata.server";

const FAKE_XML = '<?xml version="1.0"?><nachricht />';

const userDataWithBegruendung = {
  ...userDataMock,
  abschnitte: [
    {
      beschreibung: "Die beklagte Partei hat die Miete nicht gezahlt.",
      personIdAsBeklagte: "",
      personIdAsKlagende: "",
    },
  ],
};

let server: Server;
let baseUrl: string;
let receivedBody: string | undefined;

beforeAll(async () => {
  server = createServer((request, response) => {
    let body = "";
    request.on("data", (chunk) => (body += chunk));
    request.on("end", () => {
      receivedBody = body;
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ xjustizNachricht: FAKE_XML }));
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (address === null || typeof address === "string")
    throw new Error("Could not start server");
  baseUrl = `http://127.0.0.1:${address.port}/`;
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

const sonstigeAntraegeOfLastRequest = () =>
  (
    JSON.parse(receivedBody ?? "null") as {
      inhaltsdaten: { antraege: { auswahlSonstigeAntraege?: unknown[] } };
    }
  ).inhaltsdaten.antraege.auswahlSonstigeAntraege ?? [];

type LastRequest = {
  grunddaten: { verfahrensdaten: { beteiligung: unknown[] } };
  inhaltsdaten: {
    antraege: {
      sachantraege: {
        inhalt: string;
        anspruch: Array<{ fortlaufendeNummer: string }>;
      };
      nebenantraegeZinsen?: { inhalt: string };
    };
    auswahlBegruendetheit: {
      anderesKlageverfahren: {
        vortrag: Array<{
          ausfuehrungen: { inhalt: { rechtlicheWuerdigung?: string } };
        }>;
      };
    };
  };
};

const lastRequest = () => JSON.parse(receivedBody ?? "null") as LastRequest;

const INTEREST_CLAUSE =
  "nebst Zinsen in Höhe von 5 Prozentpunkten über dem jeweiligen Basiszinssatz seit Rechtshängigkeit";

describe("geldEinklagenXjustizFromUserdata", () => {
  it("requests the Hauptforderung with the same wording as the PDF", async () => {
    await geldEinklagenXjustizFromUserdata({
      userData: { ...userDataWithBegruendung, prozesszinsen: "no" },
      baseUrl,
    });

    expect(lastRequest().inhaltsdaten.antraege.sachantraege.inhalt).toBe(
      `Die beklagte Partei wird verurteilt, an die klagende Partei ${userDataMock.forderungGesamtbetrag} Euro zu zahlen.`,
    );
  });

  it("requests Zinsen only as Nebenantrag when the user selected Prozesszinsen", async () => {
    await geldEinklagenXjustizFromUserdata({
      userData: { ...userDataWithBegruendung, prozesszinsen: "yes" },
      baseUrl,
    });

    const { antraege } = lastRequest().inhaltsdaten;
    expect(antraege.sachantraege.inhalt).not.toContain(INTEREST_CLAUSE);
    expect(antraege.nebenantraegeZinsen?.inhalt).toContain(
      "Zinsen in Höhe von 5 Prozentpunkten über dem jeweiligen Basiszinssatz seit Rechtshängigkeit",
    );
  });

  it("does not request Zinsen when the user declined Prozesszinsen", async () => {
    await geldEinklagenXjustizFromUserdata({
      userData: { ...userDataWithBegruendung, prozesszinsen: "no" },
      baseUrl,
    });

    const { antraege } = lastRequest().inhaltsdaten;
    expect(antraege.sachantraege.inhalt).not.toContain(INTEREST_CLAUSE);
    expect(antraege.nebenantraegeZinsen).toBeUndefined();
  });

  it("requests the Anwaltskosten as a separate Anspruch with its amount", async () => {
    await geldEinklagenXjustizFromUserdata({
      userData: {
        ...userDataWithBegruendung,
        anwaltskosten: "150,50",
        prozesszinsen: "no",
      },
      baseUrl,
    });

    const hauptanspruch =
      lastRequest().inhaltsdaten.antraege.sachantraege.anspruch[0];
    expect(sonstigeAntraegeOfLastRequest()).toContainEqual({
      antragSonstige: {
        auswahlAntragSonstige: {
          sonstigerAntragTextform:
            "Die beklagte Partei wird verurteilt die außergerichtlich angefallenen Anwaltskosten in Höhe von 150,50 Euro zu zahlen.",
        },
        anspruch: [
          expect.objectContaining({
            fortlaufendeNummer: expect.not.stringMatching(
              `^${hauptanspruch.fortlaufendeNummer}$`,
            ) as unknown,
            wertAnspruch: expect.objectContaining({ zahl: 150.5 }) as unknown,
          }),
        ],
      },
    });
  });

  it("does not request Anwaltskosten when none were entered", async () => {
    await geldEinklagenXjustizFromUserdata({
      userData: { ...userDataWithBegruendung, anwaltskosten: "" },
      baseUrl,
    });

    expect(
      JSON.stringify(sonstigeAntraegeOfLastRequest()).includes("Anwaltskosten"),
    ).toBe(false);
  });

  it("requests the weitere Antraege as free text", async () => {
    await geldEinklagenXjustizFromUserdata({
      userData: {
        ...userDataWithBegruendung,
        weitereAntraege: "Die Kosten trägt die beklagte Partei.",
      },
      baseUrl,
    });

    expect(sonstigeAntraegeOfLastRequest()).toContainEqual(
      ergonomics.weitererAntrag(
        datatypeE("Die Kosten trägt die beklagte Partei.").value,
      ),
    );
  });

  it("includes the rechtliche Wuerdigung in the Vortrag", async () => {
    await geldEinklagenXjustizFromUserdata({
      userData: {
        ...userDataWithBegruendung,
        rechtlicheWuerdigung: "Der Anspruch folgt aus § 535 Abs. 2 BGB.",
      },
      baseUrl,
    });

    const [vortrag] =
      lastRequest().inhaltsdaten.auswahlBegruendetheit.anderesKlageverfahren
        .vortrag;
    expect(vortrag.ausfuehrungen.inhalt.rechtlicheWuerdigung).toBe(
      "Der Anspruch folgt aus § 535 Abs. 2 BGB.",
    );
  });

  it("includes the Dr. title of Klaeger and Beklagte, like the PDF", async () => {
    await geldEinklagenXjustizFromUserdata({
      userData: {
        ...userDataWithBegruendung,
        klagendePersonTitle: "dr",
        beklagteTitle: "dr",
      },
      baseUrl,
    });

    const [klaeger, beklagter] =
      lastRequest().grunddaten.verfahrensdaten.beteiligung;
    const withTitel = {
      beteiligter: {
        auswahlBeteiligter: {
          natuerlichePerson: { vollerName: { titel: "Dr." } },
        },
      },
    };
    expect(klaeger).toMatchObject(withTitel);
    expect(beklagter).toMatchObject(withTitel);
  });

  it("omits the title when none was selected", async () => {
    await geldEinklagenXjustizFromUserdata({
      userData: { ...userDataWithBegruendung, klagendePersonTitle: "none" },
      baseUrl,
    });

    const [klaeger] = lastRequest().grunddaten.verfahrensdaten.beteiligung;
    expect(JSON.stringify(klaeger)).not.toContain("titel");
  });

  it("includes the bank account of the Klaeger", async () => {
    await geldEinklagenXjustizFromUserdata({
      userData: {
        ...userDataWithBegruendung,
        klagendePersonIban: "DE68500123456789000000",
        klagendePersonKontoinhaber: "Erika Musterfrau",
      },
      baseUrl,
    });

    const [klaeger] = lastRequest().grunddaten.verfahrensdaten.beteiligung;
    expect(klaeger).toMatchObject({
      beteiligter: {
        auswahlBeteiligter: {
          natuerlichePerson: {
            bankverbindung: [
              {
                iban: "DE68500123456789000000",
                kontoinhaber: "Erika Musterfrau",
              },
            ],
          },
        },
      },
    });
  });

  it("uses the Klaeger name as Kontoinhaber when none was entered, like the PDF", async () => {
    await geldEinklagenXjustizFromUserdata({
      userData: {
        ...userDataWithBegruendung,
        klagendePersonIban: "DE68500123456789000000",
        klagendePersonKontoinhaber: "",
      },
      baseUrl,
    });

    const [klaeger] = lastRequest().grunddaten.verfahrensdaten.beteiligung;
    expect(klaeger).toMatchObject({
      beteiligter: {
        auswahlBeteiligter: {
          natuerlichePerson: {
            bankverbindung: [
              {
                kontoinhaber: `${userDataMock.klagendePersonVorname} ${userDataMock.klagendePersonNachname}`,
              },
            ],
          },
        },
      },
    });
  });

  it("requests a Versaeumnisurteil when the user selected it", async () => {
    await geldEinklagenXjustizFromUserdata({
      userData: { ...userDataWithBegruendung, versaeumnisurteil: "yes" },
      baseUrl,
    });

    expect(sonstigeAntraegeOfLastRequest()).toContainEqual(
      ergonomics.antragAufVersaeumnisurteil(),
    );
  });

  it("does not request a Versaeumnisurteil when the user declined it", async () => {
    await geldEinklagenXjustizFromUserdata({
      userData: { ...userDataWithBegruendung, versaeumnisurteil: "no" },
      baseUrl,
    });

    expect(sonstigeAntraegeOfLastRequest()).not.toContainEqual(
      ergonomics.antragAufVersaeumnisurteil(),
    );
  });

  it("includes the phone number and email of the Klaeger", async () => {
    await geldEinklagenXjustizFromUserdata({
      userData: {
        ...userDataWithBegruendung,
        klagendeTelefonnummer: "030 123456",
        klagendeEmail: "klaeger@example.com",
      },
      baseUrl,
    });

    const payload = JSON.parse(receivedBody ?? "null") as {
      grunddaten: { verfahrensdaten: { beteiligung: unknown[] } };
    };
    const [klaeger] = payload.grunddaten.verfahrensdaten.beteiligung;
    expect(klaeger).toMatchObject({
      beteiligter: {
        auswahlBeteiligter: {
          natuerlichePerson: {
            telekommunikation: [
              ergonomics.email(datatypeC("klaeger@example.com").value),
              ergonomics.telefon(datatypeC("030 123456").value),
            ],
          },
        },
      },
    });
  });

  it("reports a missing responsible court without calling the XJustiz-Tools", async () => {
    receivedBody = undefined;

    const result = await geldEinklagenXjustizFromUserdata({
      userData: {
        ...userDataWithBegruendung,
        postleitzahlBeklagtePerson: "80331",
        postleitzahlSecondary: "80331",
      },
      baseUrl,
    });

    expect(result.isErr && result.error).toStrictEqual({
      reason: "noResponsibleCourt",
    });
    expect(receivedBody).toBeUndefined();
  });

  it("addresses the message to the responsible court", async () => {
    const result = await geldEinklagenXjustizFromUserdata({
      userData: userDataWithBegruendung,
      baseUrl,
    });

    expect(result.isOk && result.value).toBe(FAKE_XML);

    const payload: unknown = JSON.parse(receivedBody ?? "null");
    expect(payload).toMatchObject({
      nachrichtenkopf: {
        empfaenger: {
          informationen: {
            auswahlKommunikationspartner: {
              gericht: Gerichte["Amtsgericht Schöneberg"],
            },
          },
        },
      },
    });
  });

  it("assigns Klaeger and Beklagte to the correct roles", async () => {
    const result = await geldEinklagenXjustizFromUserdata({
      userData: userDataWithBegruendung,
      baseUrl,
    });

    expect(result.isOk && result.value).toBe(FAKE_XML);

    const payload: unknown = JSON.parse(receivedBody ?? "null");
    expect(payload).toMatchObject({
      grunddaten: {
        verfahrensdaten: {
          beteiligung: [
            {
              rolle: [{ rollenbezeichnung: Rollenbezeichnung["Kläger(in)"] }],
              beteiligter: {
                auswahlBeteiligter: {
                  natuerlichePerson: {
                    vollerName: {
                      vorname: userDataMock.klagendePersonVorname,
                      nachname: userDataMock.klagendePersonNachname,
                    },
                    anschrift: [
                      { strasse: userDataMock.klagendePersonStrasse },
                    ],
                  },
                },
              },
            },
            {
              rolle: [{ rollenbezeichnung: Rollenbezeichnung["Beklagte(r)"] }],
              beteiligter: {
                auswahlBeteiligter: {
                  natuerlichePerson: {
                    vollerName: {
                      vorname: userDataMock.beklagteVorname,
                      nachname: userDataMock.beklagteNachname,
                    },
                    anschrift: [{ strasse: userDataMock.beklagteStrasse }],
                  },
                },
              },
            },
          ],
        },
      },
    });
  });

  it("composes a Beklagte organisation as organisation", async () => {
    const result = await geldEinklagenXjustizFromUserdata({
      userData: {
        ...userDataWithBegruendung,
        gegenWenBeklagen: "organisation",
        beklagteNameOrganisation: "Muster GmbH",
      },
      baseUrl,
    });

    expect(result.isOk && result.value).toBe(FAKE_XML);

    const payload: unknown = JSON.parse(receivedBody ?? "null");
    expect(payload).toMatchObject({
      grunddaten: {
        verfahrensdaten: {
          beteiligung: [
            {},
            {
              rolle: [{ rollenbezeichnung: Rollenbezeichnung["Beklagte(r)"] }],
              beteiligter: {
                auswahlBeteiligter: {
                  organisation: {
                    bezeichnung: { bezeichnungAktuell: "Muster GmbH" },
                    anschrift: [
                      {
                        strasse: userDataMock.beklagteStrasse,
                        postleitzahl: userDataMock.beklagtePlz,
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    });
  });

  it("reports invalid user data without calling the XJustiz-Tools", async () => {
    receivedBody = undefined;

    const result = await geldEinklagenXjustizFromUserdata({
      userData: { ...userDataWithBegruendung, klagendePersonVorname: "" },
      baseUrl,
    });

    expect(result.isErr && result.error).toMatchObject({
      reason: "invalidUserData",
    });
    expect(receivedBody).toBeUndefined();
  });

  it("includes Zeugen with unique Rollennummern and BeweisNummern", async () => {
    const zeugin = {
      personAuswahl: "anotherPerson" as const,
      personId: "zeugin-1",
      anrede: "frau" as const,
      title: "",
      vorname: "Erika",
      nachname: "Mustermann",
      strasse: "Hauptstraße",
      hausnummer: "1",
      plz: "10115",
      ort: "Berlin",
      land: "Deutschland",
      telefonnummer: "",
      email: "",
    };
    await geldEinklagenXjustizFromUserdata({
      userData: {
        ...userDataWithBegruendung,
        abschnitte: [
          { ...userDataWithBegruendung.abschnitte[0], personen: [zeugin] },
          {
            ...userDataWithBegruendung.abschnitte[0],
            personen: [
              {
                ...zeugin,
                personId: "zeugin-1-kopie",
                personReference: "0-0",
              },
              {
                ...zeugin,
                personId: "zeuge-2",
                anrede: "herr" as const,
                vorname: "Max",
              },
            ],
          },
        ],
      },
      baseUrl,
    });

    const payload = JSON.parse(receivedBody ?? "null") as {
      grunddaten: {
        verfahrensdaten: {
          beteiligung: Array<{
            rolle: Array<{
              rollennummer: string;
              rollenbezeichnung: { code: string };
            }>;
            beteiligter: unknown;
          }>;
        };
      };
      inhaltsdaten: {
        beweis: Array<{
          beweisNummer: number;
          auswahlBeweismittel: { zeugen: { refRollennummer: string } };
        }>;
        auswahlBegruendetheit: {
          anderesKlageverfahren: {
            vortrag: Array<{ ausfuehrungen: { refBeweisNummer: number[] } }>;
          };
        };
      };
    };

    const beteiligung = payload.grunddaten.verfahrensdaten.beteiligung;
    expect(beteiligung).toHaveLength(4);
    const rollennummern = beteiligung.map((b) => b.rolle[0].rollennummer);
    expect(new Set(rollennummern).size).toBe(rollennummern.length);
    const zeugeBeteiligung = beteiligung[2];
    expect(zeugeBeteiligung.rolle[0].rollenbezeichnung).toStrictEqual(
      Rollenbezeichnung["Zeuge (Zeugin)"],
    );
    expect(zeugeBeteiligung.beteiligter).toMatchObject({
      auswahlBeteiligter: {
        natuerlichePerson: {
          vollerName: { vorname: "Erika", nachname: "Mustermann" },
          anschrift: [{ strasse: "Hauptstraße", postleitzahl: "10115" }],
        },
      },
    });

    const { beweis, auswahlBegruendetheit } = payload.inhaltsdaten;
    expect(beweis.map((b) => b.beweisNummer)).toStrictEqual([1, 2]);
    expect(
      beweis.map((b) => b.auswahlBeweismittel.zeugen.refRollennummer),
    ).toStrictEqual(rollennummern.slice(2));
    expect(
      auswahlBegruendetheit.anderesKlageverfahren.vortrag[0].ausfuehrungen
        .refBeweisNummer,
    ).toStrictEqual([1, 2]);
  });

  it("references the declared Rollennummern in the Anspruch", async () => {
    await geldEinklagenXjustizFromUserdata({
      userData: userDataWithBegruendung,
      baseUrl,
    });

    const payload = JSON.parse(receivedBody ?? "null") as {
      grunddaten: {
        verfahrensdaten: {
          beteiligung: Array<{ rolle: Array<{ rollennummer: string }> }>;
        };
      };
      inhaltsdaten: {
        antraege: {
          sachantraege: {
            anspruch: Array<{
              anspruchssteller: Array<{ refRollennummer: string }>;
              anspruchsgegner: Array<{ refRollennummer: string }>;
            }>;
          };
        };
      };
    };

    const [klaeger, beklagter] = payload.grunddaten.verfahrensdaten.beteiligung;
    const [anspruch] = payload.inhaltsdaten.antraege.sachantraege.anspruch;

    expect(anspruch.anspruchssteller[0].refRollennummer).toBe(
      klaeger.rolle[0].rollennummer,
    );
    expect(anspruch.anspruchsgegner[0].refRollennummer).toBe(
      beklagter.rolle[0].rollennummer,
    );
  });
});
