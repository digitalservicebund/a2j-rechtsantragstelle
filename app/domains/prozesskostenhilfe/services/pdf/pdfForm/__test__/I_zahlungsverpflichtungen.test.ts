import type { ProzesskostenhilfePDF } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import { getProzesskostenhilfeParameters } from "data/pdf/prozesskostenhilfe/prozesskostenhilfe.generated";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/services/pdf/attachment";
import { fillZahlungsverpflichtungen } from "../I_zahlungsverpflichtungen";

let pdfParams: ProzesskostenhilfePDF;

describe("I_zahlungsverpflichtungen", () => {
  beforeEach(() => {
    pdfParams = getProzesskostenhilfeParameters();
  });

  it("should fill the PDF values for 1 short description", () => {
    const userData: ProzesskostenhilfeFormularContext = {
      ratenzahlungen: [
        {
          art: "Ratenzahlung",
          zahlungsempfaenger: "Empfänger 1",
          zahlungspflichtiger: "myselfAndPartner",
          betragEigenerAnteil: "50",
          betragGesamt: "100",
          restschuld: "1000",
          laufzeitende: "31.12.2050",
        },
      ],
      sonstigeAusgaben: [],
      versicherungen: [],
      hasAusgaben: "yes",
    };

    const { pdfValues } = fillZahlungsverpflichtungen({
      userData,
      pdfValues: pdfParams,
    });

    expect(pdfValues.sonstigeZahlungsverpflichtungen1.value).toBe(
      "Ratenzahlung, Empfänger 1, bis 31.12.2050",
    );
    expect(pdfValues.restschuldinEUR.value).toBe("1000");
    expect(pdfValues.monatlicheGesamtbelastung1.value).toBe("100");
    expect(pdfValues.ichalleinzahledavon3.value).toBe("50");
    expect(pdfValues.sonstigeZahlungsverpflichtungen2.value).toBe(undefined);
    expect(pdfValues.restschuldinEUR_2.value).toBe(undefined);
    expect(pdfValues.monatlicheGesamtbelastung2.value).toBe(undefined);
    expect(pdfValues.ichalleinzahledavon4.value).toBe(undefined);
  });

  it("should fill the PDF values for 2 short descriptions", () => {
    const userData: ProzesskostenhilfeFormularContext = {
      ratenzahlungen: [
        {
          art: "Ratenzahlung",
          zahlungsempfaenger: "Empfänger 1",
          zahlungspflichtiger: "myself",
          betragEigenerAnteil: "50",
          betragGesamt: "100",
          restschuld: "1000",
          laufzeitende: "31.12.2050",
        },
      ],
      sonstigeAusgaben: [
        {
          art: "Sonstige Ausgabe",
          zahlungsempfaenger: "Empfänger 2",
          zahlungspflichtiger: "myselfAndSomeoneElse",
          betragEigenerAnteil: "100",
          betragGesamt: "200",
        },
      ],
      versicherungen: [],
      hasAusgaben: "yes",
    };

    const { pdfValues } = fillZahlungsverpflichtungen({
      userData,
      pdfValues: pdfParams,
    });

    expect(pdfValues.sonstigeZahlungsverpflichtungen1.value).toBe(
      "Ratenzahlung, Empfänger 1, bis 31.12.2050",
    );
    expect(pdfValues.restschuldinEUR.value).toBe("1000");
    expect(pdfValues.monatlicheGesamtbelastung1.value).toBe("100");
    expect(pdfValues.ichalleinzahledavon3.value).toBe("50");
    expect(pdfValues.sonstigeZahlungsverpflichtungen2.value).toBe(
      "Sonstige Ausgabe, Empfänger 2",
    );
    expect(pdfValues.restschuldinEUR_2.value).toBe(undefined);
    expect(pdfValues.monatlicheGesamtbelastung2.value).toBe("200");
    expect(pdfValues.ichalleinzahledavon4.value).toBe("100");
    expect(pdfValues.sonstigeZahlungsverpflichtungen3.value).toBe(undefined);
    expect(pdfValues.restschuldinEUR_3.value).toBe(undefined);
    expect(pdfValues.monatlicheGesamtbelastung3.value).toBe(undefined);
    expect(pdfValues.ichalleinzahledavon5.value).toBe(undefined);
  });

  it("should fill the PDF values for 3 short descriptions", () => {
    const userData: ProzesskostenhilfeFormularContext = {
      ratenzahlungen: [
        {
          art: "Ratenzahlung",
          zahlungsempfaenger: "Empfänger 1",
          zahlungspflichtiger: "myself",
          betragEigenerAnteil: "50",
          betragGesamt: "100",
          restschuld: "1000",
          laufzeitende: "31.12.2050",
        },
      ],
      sonstigeAusgaben: [
        {
          art: "Sonstige Ausgabe",
          zahlungsempfaenger: "Empfänger 2",
          zahlungspflichtiger: "myselfAndPartner",
          betragEigenerAnteil: "100",
          betragGesamt: "200",
        },
      ],
      versicherungen: [
        {
          art: "haftpflichtversicherung",
          beitrag: "50",
        },
      ],
      hasAusgaben: "yes",
    };

    const { pdfValues } = fillZahlungsverpflichtungen({
      userData,
      pdfValues: pdfParams,
    });

    expect(pdfValues.sonstigeZahlungsverpflichtungen1.value).toBe(
      "Ratenzahlung, Empfänger 1, bis 31.12.2050",
    );
    expect(pdfValues.restschuldinEUR.value).toBe("1000");
    expect(pdfValues.monatlicheGesamtbelastung1.value).toBe("100");
    expect(pdfValues.ichalleinzahledavon3.value).toBe("50");
    expect(pdfValues.sonstigeZahlungsverpflichtungen2.value).toBe(
      "Sonstige Ausgabe, Empfänger 2",
    );
    expect(pdfValues.restschuldinEUR_2.value).toBe(undefined);
    expect(pdfValues.monatlicheGesamtbelastung2.value).toBe("200");
    expect(pdfValues.ichalleinzahledavon4.value).toBe("100");
    expect(pdfValues.sonstigeZahlungsverpflichtungen3.value).toBe(
      "Haftpflichtversicherung",
    );
    expect(pdfValues.restschuldinEUR_3.value).toBe(undefined);
    expect(pdfValues.monatlicheGesamtbelastung3.value).toBe("50");
    expect(pdfValues.ichalleinzahledavon5.value).toBe(undefined);
  });

  it("should create an attachment if there are more than 3 short descriptions", () => {
    const userData: ProzesskostenhilfeFormularContext = {
      ratenzahlungen: [
        {
          art: "Ratenzahlung",
          zahlungsempfaenger: "Empfänger 1",
          zahlungspflichtiger: "myselfAndSomeoneElse",
          betragEigenerAnteil: "50",
          betragGesamt: "100",
          restschuld: "1000",
          laufzeitende: "31.12.2050",
        },
      ],
      sonstigeAusgaben: [
        {
          art: "Sonstige Ausgabe",
          zahlungsempfaenger: "Empfänger 2",
          zahlungspflichtiger: "myself",
          betragEigenerAnteil: "100",
          betragGesamt: "200",
        },
      ],
      versicherungen: [
        {
          art: "haftpflichtversicherung",
          beitrag: "50",
        },
        {
          art: "sonstige",
          beitrag: "30",
          sonstigeArt: "Spezialversicherung",
        },
      ],
      hasAusgaben: "yes",
    };

    const { pdfValues, attachment } = fillZahlungsverpflichtungen({
      userData,
      pdfValues: pdfParams,
    });

    expect(pdfValues.sonstigeZahlungsverpflichtungen1.value).toBe(
      SEE_IN_ATTACHMENT_DESCRIPTION,
    );

    expect(attachment).toEqual([
      { level: "h2", title: "Sonstige Zahlungsverpflichtungen" },
      { level: "h3", title: "Ratenzahlung" },
      {
        title: "Zahlungspflichtiger",
        text: "Ich gemeinsam mit jemand anderem",
      },
      { title: "Zahlungsempfänger", text: "Empfänger 1" },
      { title: "Gesamtbelastung monatlich", text: "100" },
      { title: "Eigenbelastung monatlich", text: "50" },
      { title: "Restschuld in EUR", text: "1000" },
      { title: "Laufzeitende", text: "31.12.2050" },
      { level: "h3", title: "Sonstige Ausgabe" },
      { title: "Zahlungspflichtiger", text: "Ich alleine" },
      { title: "Zahlungsempfänger", text: "Empfänger 2" },
      { title: "Gesamtbelastung monatlich", text: "200" },
      { level: "h3", title: "Versicherungen" },
      { level: "h4", title: "Versicherung 1" },
      { title: "Art", text: "Haftpflichtversicherung" },
      { title: "Beitrag", text: "50 € / Monat" },
      { level: "h4", title: "Versicherung 2" },
      { title: "Art", text: "Spezialversicherung" },
      { title: "Beitrag", text: "30 € / Monat" },
    ]);
  });

  it("should create an attachment if there is one long description", () => {
    const userData: ProzesskostenhilfeFormularContext = {
      ratenzahlungen: [
        {
          art: "Ratenzahlung mit sehr langer Beschreibung die länger als 41 Zeichen ist",
          zahlungsempfaenger: "Empfänger 1",
          zahlungspflichtiger: "myselfAndPartner",
          betragEigenerAnteil: "50",
          betragGesamt: "100",
          restschuld: "100",
          laufzeitende: "31.12.2050",
        },
      ],
      sonstigeAusgaben: [],
      versicherungen: [],
      hasAusgaben: "yes",
    };

    const { pdfValues, attachment } = fillZahlungsverpflichtungen({
      userData,
      pdfValues: pdfParams,
    });

    expect(pdfValues.sonstigeZahlungsverpflichtungen1.value).toBe(
      SEE_IN_ATTACHMENT_DESCRIPTION,
    );
    expect(attachment?.length).toBeGreaterThan(0);
  });
});
