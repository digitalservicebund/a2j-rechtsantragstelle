import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { createBegruendung } from "../createBegruendung";

describe("createBegruendung", () => {
  it("should add a missing-data notice when no Begründung is provided", () => {
    const { doc, documentStruct } = createPdfTestContext();

    createBegruendung(doc, documentStruct, emptyUserData);

    expect(doc.addPage).toHaveBeenCalled();
    expect(getPrintedText(doc)).toContain("Begründung");
    expect(getPrintedText(doc)).toContain("Fehlende Angaben: Sachverhalt");
  });

  it("should print absaetze and attached document evidence", () => {
    const { doc, documentStruct } = createPdfTestContext();

    createBegruendung(doc, documentStruct, {
      ...emptyUserData,
      hauptantrag: [
        {
          betragForderung: "100",
          beklagte: {},
          id: "zahlungsantrag-1",
          klagende: {},
          zinsbeginn: { day: "", month: "" },
          zinsende: { day: "", month: "" },
        },
      ],
      vortraege: [
        {
          antragId: "zahlungsantrag-1",
          absaetze: [
            {
              formulierung: "Die Rechnung ist offen.",
              beweise: [{ type: "urkunde", beschreibung: "Rechnung" }],
            },
          ],
        },
      ],
    });

    expect(getPrintedText(doc)).toContain("Die Rechnung ist offen.");
    expect(getPrintedText(doc)).toContain("Rechnung");
    expect(getPrintedText(doc)).not.toContain("Fehlende Angaben: Sachverhalt");
    expect(doc.text).toHaveBeenCalledWith(
      "Beweis (K1): ",
      PDF_MARGIN_HORIZONTAL + 16,
      undefined,
      { continued: true },
    );
    expect(doc.text).toHaveBeenCalledWith("Rechnung");
  });

  it("groups paragraphs and evidence under their corresponding request headings", () => {
    const { doc, documentStruct } = createPdfTestContext();
    const forderung = {
      klagende: {},
      beklagte: {},
      zinsbeginn: { day: "", month: "" },
      zinsende: { day: "", month: "" },
    };

    createBegruendung(doc, documentStruct, {
      hauptantrag: [
        { ...forderung, id: "first", betragForderung: "100" },
        {
          ...forderung,
          id: "second",
          betragForderung: "200",
          nebenantraege: [
            {
              id: "neben",
              type: "nebenantrag",
              nebenantragArt: "mahnkosten",
              nebenantragBetrag: "10",
            },
            {
              id: "annahmeverzug",
              type: "annahmeverzug",
              annahmeverzugsFeststellung: "on",
              annahmeverzugDatum: { day: "", month: "" },
            },
          ],
        },
      ],
      schmerzengeldantrag: [
        { ...forderung, id: "schmerz", mindestBetrag: "100" },
      ],
      sonstigeAntraege: [{ id: "sonstig", antrag: "Sonstiger Antrag" }],
      muendlicheVerhandlung: "on",
      vortraege: [
        {
          antragId: "first",
          absaetze: [
            {
              formulierung: "Erster Absatz",
              beweise: [{ type: "urkunde", beschreibung: "Erste Urkunde" }],
            },
            { formulierung: "Zweiter Absatz" },
          ],
        },
        {
          antragId: "second",
          absaetze: [
            {
              formulierung: "Zweiter Antrag",
              beweise: [{ type: "urkunde", beschreibung: "Zweite Urkunde" }],
            },
          ],
        },
        {
          antragId: "neben",
          absaetze: [
            {
              formulierung: "Mahnkosten",
              beweise: [{ type: "urkunde", beschreibung: "Mahnung" }],
            },
            { formulierung: "Weitere Mahnkosten" },
          ],
        },
        {
          antragId: "annahmeverzug",
          absaetze: [{ formulierung: "Annahmeverzug" }],
        },
        { antragId: "schmerz", absaetze: [{ formulierung: "Schmerzensgeld" }] },
        { antragId: "sonstig", absaetze: [{ formulierung: "Sonstiges" }] },
        {
          antragId: "muendlicheVerhandlung",
          absaetze: [{ formulierung: "Verhandlung" }],
        },
      ],
    });

    expect(getPrintedText(doc)).toEqual([
      "Begründung",
      "I. Sachverhalt",
      "zu Antrag 1)",
      "Erster Absatz",
      "Beweis (K1): ",
      "Erste Urkunde",
      "Zweiter Absatz",
      "zu Antrag 2)",
      "Zweiter Antrag",
      "Beweis (K2): ",
      "Zweite Urkunde",
      "zu Antrag 2) – Mahnkosten",
      "Mahnkosten",
      "Beweis (K3): ",
      "Mahnung",
      "Weitere Mahnkosten",
      "zu Antrag 2) – Annahmeverzug",
      "Annahmeverzug",
      "zu Antrag 3)",
      "Schmerzensgeld",
      "zu Antrag 4)",
      "Sonstiges",
      "zu Prozessantrag – Mündliche Verhandlung",
      "Verhandlung",
    ]);
  });

  it("formats witnesses and selected parties as indented evidence lists", () => {
    const { doc, documentStruct } = createPdfTestContext();
    const plaintiffId = "11111111-1111-4111-8111-111111111111";
    const plaintiffRepresentativeId = "22222222-2222-4222-8222-222222222222";
    const defendantRepresentativeId = "33333333-3333-4333-8333-333333333333";
    const defendantId = "55555555-5555-4555-8555-555555555555";
    createBegruendung(doc, documentStruct, {
      klagenden: [
        {
          id: plaintiffId,
          type: "natuerliche-person",
          anrede: "frau",
          titel: "",
          vorname: "Anna",
          nachname: "Muster",
          strasse: "Hauptstraße",
          hausnummer: "1",
          plz: "10115",
          ort: "Berlin",
          land: "Deutschland",
          "gesetzliche-vertretung": [
            {
              id: plaintiffRepresentativeId,
              art: "elternteil",
              anrede: "frau",
              titel: "",
              vorname: "Maria",
              nachname: "Muster",
              strasse: "Hauptstraße",
              hausnummer: "1",
              plz: "10115",
              ort: "Berlin",
              land: "Deutschland",
            },
          ],
        },
      ],
      beklagten: [
        {
          id: "44444444-4444-4444-8444-444444444444",
          type: "organisation",
          orgName: "Beispiel GmbH",
          orgVertretungId: defendantRepresentativeId,
          orgVertretungArt: "geschaeftsfuehrer-geschaeftsfuehrerin",
          orgVertretungAnrede: "herr",
          orgVertretungTitel: "dr",
          orgVertretungVorname: "Max",
          orgVertretungNachname: "Beispiel",
          strasse: "Hauptstraße",
          hausnummer: "1",
          plz: "10115",
          ort: "Berlin",
          land: "Deutschland",
        },
        {
          id: defendantId,
          type: "natuerliche-person",
          anrede: "herr",
          titel: "",
          vorname: "Paul",
          nachname: "Beispiel",
          strasse: "Hauptstraße",
          hausnummer: "1",
          plz: "10115",
          ort: "Berlin",
          land: "Deutschland",
        },
      ],
      hauptantrag: [
        {
          id: "first",
          betragForderung: "100",
          klagende: {},
          beklagte: {},
          zinsbeginn: { day: "", month: "" },
          zinsende: { day: "", month: "" },
        },
      ],
      vortraege: [
        {
          antragId: "first",
          absaetze: [
            {
              formulierung: "Sachverhalt",
              beweise: [
                {
                  type: "zeuge",
                  anrede: "herr",
                  titel: "",
                  vorname: "Max",
                  nachname: "Muster",
                  strasse: "Beispielstraße",
                  hausnummer: "2",
                  plz: "10115",
                  ort: "Berlin",
                  land: "Deutschland",
                },
                {
                  type: "parteivernehmung",
                  personen: {
                    [plaintiffId]: "on",
                    [plaintiffRepresentativeId]: "on",
                    [defendantRepresentativeId]: "on",
                    [defendantId]: "on",
                  },
                },
                {
                  type: "zeuge",
                  anrede: "frau",
                  titel: "",
                  vorname: "Lisa",
                  nachname: "Beispiel",
                  strasse: "Nebenstraße",
                  hausnummer: "3",
                  plz: "10115",
                  ort: "Berlin",
                  land: "Deutschland",
                },
                {
                  type: "zeuge",
                  anrede: "frau",
                  titel: "",
                  vorname: "Maria",
                  nachname: "Muster",
                  strasse: "",
                  hausnummer: "",
                  plz: "",
                  ort: "",
                  land: "",
                },
                {
                  type: "zeuge",
                  anrede: "none",
                  titel: "",
                  vorname: "",
                  nachname: "",
                  strasse: "Musterstraße",
                  hausnummer: "1",
                  plz: "",
                  ort: "",
                  land: "",
                },
              ],
            },
          ],
        },
      ],
    });

    expect(doc.text).toHaveBeenCalledWith(
      "Beweis angeboten durch Vernehmung der folgenden Personen als Zeugen oder Zeuginnen:",
      PDF_MARGIN_HORIZONTAL + 16,
    );
    expect(doc.text).toHaveBeenCalledWith(
      "• ",
      PDF_MARGIN_HORIZONTAL + 24,
      undefined,
      { continued: true },
    );
    expect(doc.text).toHaveBeenCalledWith("Herr Max Muster", {
      continued: true,
    });
    expect(doc.text).toHaveBeenCalledWith(
      ", Beispielstraße 2, 10115 Berlin, Deutschland",
    );
    expect(doc.text).toHaveBeenCalledWith("Frau Lisa Beispiel", {
      continued: true,
    });
    expect(doc.text).toHaveBeenCalledWith(
      ", Nebenstraße 3, 10115 Berlin, Deutschland",
    );
    expect(doc.text).toHaveBeenCalledWith("Frau Maria Muster");
    expect(doc.text).toHaveBeenCalledWith(
      "• Musterstraße 1",
      PDF_MARGIN_HORIZONTAL + 24,
    );
    const fontForText = (text: string) => {
      const textIndex = vi
        .mocked(doc.text)
        .mock.calls.findIndex(([value]) => value === text);
      expect(textIndex).toBeGreaterThanOrEqual(0);
      const textOrder = vi.mocked(doc.text).mock.invocationCallOrder[textIndex];
      const fonts = vi.mocked(doc.font).mock;
      const fontIndex = fonts.invocationCallOrder.findLastIndex(
        (order) => order < textOrder,
      );
      return fonts.calls[fontIndex]?.[0];
    };
    expect(fontForText("Herr Max Muster")).toBe(FONTS_BUNDESSANS_BOLD);
    expect(fontForText(", Beispielstraße 2, 10115 Berlin, Deutschland")).toBe(
      FONTS_BUNDESSANS_REGULAR,
    );
    expect(fontForText("Frau Maria Muster")).toBe(FONTS_BUNDESSANS_BOLD);
    expect(fontForText("Kläger zu 1) Frau Anna Muster")).toBe(
      FONTS_BUNDESSANS_BOLD,
    );
    expect(fontForText("Beklagter zu 1) Herr Paul Beispiel")).toBe(
      FONTS_BUNDESSANS_BOLD,
    );
    expect(fontForText("• Gesetzliche Vertretung von Kläger zu 1)")).toBe(
      FONTS_BUNDESSANS_REGULAR,
    );
    expect(fontForText("Elternteil, Frau Maria Muster")).toBe(
      FONTS_BUNDESSANS_BOLD,
    );
    expect(fontForText("• Gesetzliche Vertretung von Beklagtem zu 2)")).toBe(
      FONTS_BUNDESSANS_REGULAR,
    );
    expect(
      fontForText("Geschäftsführer / Geschäftsführerin, Herr Dr. Max Beispiel"),
    ).toBe(FONTS_BUNDESSANS_BOLD);
    expect(
      getPrintedText(doc).filter(
        (text) =>
          text ===
          "Beweis angeboten durch Vernehmung der folgenden Personen als Zeugen oder Zeuginnen:",
      ),
    ).toHaveLength(1);
    expect(doc.text).toHaveBeenCalledWith(
      "Beweis angeboten durch Parteivernehmung der folgenden Personen:",
      PDF_MARGIN_HORIZONTAL + 16,
    );
    expect(doc.text).toHaveBeenCalledWith("Kläger zu 1) Frau Anna Muster");
    expect(doc.text).toHaveBeenCalledWith(
      "• Gesetzliche Vertretung von Kläger zu 1)",
      PDF_MARGIN_HORIZONTAL + 24,
    );
    expect(doc.text).toHaveBeenCalledWith(
      "Elternteil, Frau Maria Muster",
      PDF_MARGIN_HORIZONTAL + 32,
    );
    expect(doc.text).toHaveBeenCalledWith(
      "• Gesetzliche Vertretung von Beklagtem zu 2)",
      PDF_MARGIN_HORIZONTAL + 24,
    );
    expect(doc.text).toHaveBeenCalledWith(
      "Geschäftsführer / Geschäftsführerin, Herr Dr. Max Beispiel",
      PDF_MARGIN_HORIZONTAL + 32,
    );
  });

  it("prints the Nebenantrag heading when the parent has no paragraphs", () => {
    const { doc, documentStruct } = createPdfTestContext();
    const forderung = {
      klagende: {},
      beklagte: {},
      zinsbeginn: { day: "", month: "" },
      zinsende: { day: "", month: "" },
    };

    createBegruendung(doc, documentStruct, {
      hauptantrag: [
        { ...forderung, id: "first", betragForderung: "100" },
        {
          ...forderung,
          id: "second",
          betragForderung: "200",
          nebenantraege: [
            {
              id: "neben",
              type: "nebenantrag",
              nebenantragArt: "mahnkosten",
              nebenantragBetrag: "10",
            },
          ],
        },
      ],
      vortraege: [
        { antragId: "first", absaetze: [{ formulierung: "Erster Antrag" }] },
        { antragId: "neben", absaetze: [{ formulierung: "Mahnkosten" }] },
      ],
    });

    expect(getPrintedText(doc)).toEqual([
      "Begründung",
      "I. Sachverhalt",
      "zu Antrag 1)",
      "Erster Antrag",
      "zu Antrag 2) – Mahnkosten",
      "Mahnkosten",
    ]);
  });

  it("labels Schmerzensgeld-Nebenanträge separately even when their types match", () => {
    const { doc, documentStruct } = createPdfTestContext();
    createBegruendung(doc, documentStruct, {
      schmerzengeldantrag: [
        {
          id: "schmerz",
          mindestBetrag: "100",
          klagende: {},
          beklagte: {},
          zinsbeginn: { day: "", month: "" },
          zinsende: { day: "", month: "" },
          nebenantraege: [
            {
              id: "neben-1",
              schmerzengeldNebenantragArt: "mahnkosten",
              schmerzengeldNebenantragBetrag: "10",
            },
            {
              id: "neben-2",
              schmerzengeldNebenantragArt: "mahnkosten",
              schmerzengeldNebenantragBetrag: "20",
            },
          ],
        },
      ],
      vortraege: [
        { antragId: "neben-1", absaetze: [{ formulierung: "Erste Kosten" }] },
        { antragId: "neben-2", absaetze: [{ formulierung: "Zweite Kosten" }] },
      ],
    });

    expect(getPrintedText(doc)).toEqual([
      "Begründung",
      "I. Sachverhalt",
      "zu Antrag 1) – Mahnkosten",
      "Erste Kosten",
      "zu Antrag 1) – Mahnkosten",
      "Zweite Kosten",
    ]);
  });
});
