import { createServer, type Server } from "node:http";
import { Gerichte } from "@digitalservicebund/a2j-xjustiz-bridge/nachricht/zahlungsklage";
import { userDataMock } from "~/domains/geldEinklagen/services/pdf/__test__/userDataMock";
// oxlint-disable-next-line no-unassigned-import
import "~/services/xjustiz/installTemporalPolyfill.server";
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
    throw new Error("Server konnte nicht gestartet werden");
  baseUrl = `http://127.0.0.1:${address.port}/`;
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

describe("geldEinklagenXjustizFromUserdata", () => {
  it("komponiert eine Zahlungsklage und sendet sie an die XJustiz-Tools", async () => {
    const result = await geldEinklagenXjustizFromUserdata({
      userData: userDataWithBegruendung,
      gericht: Gerichte["Amtsgericht Schöneberg"],
      baseUrl,
    });

    expect(result).toStrictEqual({ ok: true, xjustizMessageXml: FAKE_XML });

    const payload: unknown = JSON.parse(receivedBody ?? "null");
    expect(payload).toMatchObject({
      nachrichtenkopf: {
        xjustizVersion: "3.6.2",
        empfaenger: {
          informationen: {
            auswahlKommunikationspartner: { gericht: { code: "F1106" } },
          },
        },
      },
      grunddaten: {
        verfahrensdaten: {
          beteiligung: [
            { rolle: [{ rollenbezeichnung: { code: "101" } }] },
            { rolle: [{ rollenbezeichnung: { code: "028" } }] },
          ],
        },
      },
    });
  });

  it("nimmt Zeugen mit eindeutigen Rollen- und Beweisnummern auf", async () => {
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
      gericht: Gerichte["Amtsgericht Schöneberg"],
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
    expect(zeugeBeteiligung.rolle[0].rollenbezeichnung.code).toBe("202");
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

  it("referenziert im Anspruch die deklarierten Rollennummern", async () => {
    await geldEinklagenXjustizFromUserdata({
      userData: userDataWithBegruendung,
      gericht: Gerichte["Amtsgericht Schöneberg"],
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
