import {
  createPdfTestContext,
  emptyUserData,
  getPrintedText,
} from "./pdfTestHelpers";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
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
      "zu Antrag 1",
      "Erster Absatz",
      "Beweis (K1): ",
      "Erste Urkunde",
      "Zweiter Absatz",
      "zu Antrag 2",
      "Zweiter Antrag",
      "Beweis (K2): ",
      "Zweite Urkunde",
      "Mahnkosten",
      "Beweis (K3): ",
      "Mahnung",
      "Annahmeverzug",
      "zu Antrag 3",
      "Schmerzensgeld",
      "zu Antrag 4",
      "Sonstiges",
      "zu Prozessantrag – Mündliche Verhandlung",
      "Verhandlung",
    ]);
  });

  it("formats witnesses and selected parties as indented evidence lists", () => {
    const { doc, documentStruct } = createPdfTestContext();
    const plaintiffId = "11111111-1111-4111-8111-111111111111";
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
                { type: "parteivernehmung", personen: { [plaintiffId]: "on" } },
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
      "• Herr Max Muster, Beispielstraße 2, 10115 Berlin, Deutschland",
      PDF_MARGIN_HORIZONTAL + 24,
    );
    expect(doc.text).toHaveBeenCalledWith(
      "• Frau Lisa Beispiel, Nebenstraße 3, 10115 Berlin, Deutschland",
      PDF_MARGIN_HORIZONTAL + 24,
    );
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
    expect(doc.text).toHaveBeenCalledWith(
      "• Kläger zu 1) Frau Anna Muster",
      PDF_MARGIN_HORIZONTAL + 24,
    );
  });

  it("prints the parent heading when only a Nebenantrag has paragraphs", () => {
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
      "zu Antrag 1",
      "Erster Antrag",
      "zu Antrag 2",
      "Mahnkosten",
    ]);
  });
});
