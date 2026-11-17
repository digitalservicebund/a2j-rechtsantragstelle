import { userDataMock } from "~/domains/geldEinklagen/services/pdf/__test__/userDataMock";
import { geldEinklagenXjustizFromUserdata } from "~/domains/geldEinklagen/services/xjustiz/geldEinklagenXjustizFromUserdata.server";

// Runs against real XJustiz-Tools, which build and validate the XML.
// Example: XJUSTIZ_TOOLS_BASE_URL=http://localhost:8888/ pnpm vitest run --project=integration xjustiz
const baseUrl = process.env.XJUSTIZ_TOOLS_BASE_URL;

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

const generate = async (
  userData: Parameters<typeof geldEinklagenXjustizFromUserdata>[0]["userData"],
) => {
  const result = await geldEinklagenXjustizFromUserdata({
    userData,
    baseUrl: baseUrl ?? "",
  });
  if (result.isErr) throw new Error(JSON.stringify(result.error));
  return result.value;
};

describe.runIf(baseUrl)("XJustiz Zahlungsklage against XJustiz-Tools", () => {
  it(
    "generates a message with Antraege, Verhandlung texts and Beweise",
    {
      timeout: 180_000,
    },
    async () => {
      const xml = await generate({
        ...userDataMock,
        prozesszinsen: "yes",
        anwaltskosten: "1.000.000,00",
        versaeumnisurteil: "yes",
        muendlicheVerhandlung: "yes",
        videoVerhandlung: "no",
        streitbeilegung: "yes",
        rechtlicheWuerdigung: "Der Anspruch folgt aus § 535 Abs. 2 BGB.",
        abschnitte: [
          {
            beschreibung: "Die Miete wurde nicht gezahlt.",
            personIdAsBeklagte: "",
            personIdAsKlagende: "",
            dokumenten: [{ beschreibung: "Mietvertrag" }],
            personen: [zeugin, { personAuswahl: "klagende", personId: "k-1" }],
          },
          {
            beschreibung: "Auch nach Mahnung erfolgte keine Zahlung.",
            personIdAsBeklagte: "",
            personIdAsKlagende: "",
            dokumenten: [
              { beschreibung: "Mietvertrag", dokumentReference: "0-0" },
              { beschreibung: "Mahnung" },
            ],
            personen: [
              { ...zeugin, personId: "zeugin-kopie", personReference: "0-0" },
            ],
          },
        ],
      });

      expect(xml).toContain(
        "<tns:gegenstand>Klage im Online-Verfahren nach Buch 12 Abschnitt 2 der Zivilprozessordnung</tns:gegenstand>",
      );
      expect(xml).toContain("<tns:nebenantraege.zinsen>");
      expect(xml).toContain("<tns:zahl>1000000.0</tns:zahl>");
      expect(xml).toContain("<tns:antragWerteliste");
      expect(xml).toContain("<tns:sonstigeProzessualeAusfuehrungen>");
      expect(xml).toContain("<tns:schlagwort>Sachverhalt 2</tns:schlagwort>");
      expect(xml).toContain("<tns:schlagwort>Beweis K2</tns:schlagwort>");
      expect(xml).toContain("<tns:fremdeVortragsID>");
      expect(xml).toContain("<tns:parteivernehmung>");
      expect(xml).toContain(
        "<tns:schlagwort>Rechtliche Würdigung</tns:schlagwort>",
      );
      expect(xml.match(/<tns:zeugen>/g)).toHaveLength(1);
    },
  );

  it(
    "generates a message when all Abschnitte were deleted",
    {
      timeout: 180_000,
    },
    async () => {
      const xml = await generate({ ...userDataMock, abschnitte: [] });

      expect(xml).toContain("<tns:schlagwort>Sachverhalt</tns:schlagwort>");
    },
  );
});
