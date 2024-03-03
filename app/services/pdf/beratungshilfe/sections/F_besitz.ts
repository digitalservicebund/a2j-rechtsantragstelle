import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "../beratungshilfe.generated";
import { Attachment } from "../attachment";

export function fillBesitz(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
  attachment: Attachment,
) {
  const financialAttachment = new Attachment(context);

  fillFinancialBankkonto(pdfFields, context, financialAttachment);
  fillFinancialGrundeigentum(pdfFields, context, financialAttachment);
  fillFinancialKraftfahrzeug(pdfFields, context, financialAttachment);
  fillFinancialWertsachen(pdfFields, context, financialAttachment);

  if (financialAttachment.shouldCreateAttachment) {
    financialAttachment.descriptions.unshift({
      title: "F Bankkonten/Grundeigentum/Kraftfahrzeuge/Bargeld/Vermögenswerte",
      text: "",
    });

    attachment.shouldCreateAttachment = true;
    attachment.descriptions = financialAttachment.descriptions.concat(
      financialAttachment.descriptions,
    );
  }
}

const eigentuemerMapping = {
  myself: "Ich alleine",
  partner: "Ehe-Partner:in",
  myselfAndPartner: "Mein:e Ehe-Partner:in und ich gemeinsam",
  myselfAndSomeoneElse: "Ich gemeinsam mit jemand anderem",
};

function fillFinancialBankkonto(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
  attachment: Attachment,
) {
  const hasBankkonten = context.bankkonten
    ? context.bankkonten?.length > 0
    : false;
  pdfFields.f1Konten1.value = !hasBankkonten;
  pdfFields.f1Konten2.value = hasBankkonten;

  if (context.bankkonten && context.bankkonten.length > 0) {
    if (context.bankkonten.length == 1) {
      const bankkonto = context.bankkonten.pop();

      pdfFields.f1InhaberA.value = bankkonto?.kontoEigentuemer == "myself";
      pdfFields.f2InhaberB.value = bankkonto?.kontoEigentuemer == "partner";
      pdfFields.f2InhaberC.value =
        bankkonto?.kontoEigentuemer == "myselfAndPartner";

      const bezeichnung = getBankkontoBezeichnung(bankkonto);

      pdfFields.f3Bank1.value = bezeichnung.join(", ");
      pdfFields.f4Kontostand.value = `${bankkonto?.kontostand} €`;
    } else {
      attachment.shouldCreateAttachment = true;
      const bezeichnung: string[] = [];

      context.bankkonten.forEach((bankkonto) => {
        bezeichnung.push(getBankkontoBezeichnung(bankkonto, true).join("\n"));
      });

      attachment.descriptions.unshift({
        title: "Bankkonten",
        text: bezeichnung.join("\n\n"),
      });
    }
  }
}

function fillFinancialGrundeigentum(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
  attachment: Attachment,
) {
  const hasGrundeigentum = context.grundeigentum
    ? context.grundeigentum?.length > 0
    : false;
  const hasGrundeigentumBewohnt = context.grundeigentumBewohnt
    ? context.grundeigentumBewohnt?.length > 0
    : false;

  pdfFields.f5Grundeigentum1.value =
    !hasGrundeigentum && !hasGrundeigentumBewohnt;
  pdfFields.f5Grundeigentum2.value =
    hasGrundeigentum || hasGrundeigentumBewohnt;

  if (
    context.grundeigentum &&
    context.grundeigentum?.length == 1 &&
    context.grundeigentumBewohnt?.length == 0
  ) {
    const grundeigentumBewohnt = context.grundeigentumBewohnt.pop();

    pdfFields.f1InhaberA.value = grundeigentumBewohnt?.eigentuemer == "myself";
    pdfFields.f2InhaberB.value = grundeigentumBewohnt?.eigentuemer == "partner";
    pdfFields.f2InhaberC.value =
      grundeigentumBewohnt?.eigentuemer == "myselfAndPartner";

    const bezeichnung =
      getGrundeigentumBewohntBezeichnung(grundeigentumBewohnt);

    pdfFields.f7Nutzungsart.value = bezeichnung.join(", ");
  } else if (
    (context.grundeigentumBewohnt?.length ?? 0) > 0 ||
    (context.grundeigentum?.length ?? 0) > 0
  ) {
    const bezeichnung: string[] = [];

    context.grundeigentum?.forEach((grundeigentum) => {
      bezeichnung.push(
        getGrundeigentumBezeichnung(grundeigentum, true).join("\n"),
      );
    });

    context.grundeigentumBewohnt?.forEach((grundeigentum) => {
      bezeichnung.push(
        getGrundeigentumBewohntBezeichnung(grundeigentum, true).join("\n"),
      );
    });

    pdfFields.f7Nutzungsart.value = attachment.newPageHint;
    attachment.shouldCreateAttachment = true;
    attachment.descriptions.unshift({
      title: "Grundeigentum",
      text: bezeichnung.join("\n\n"),
    });
  }
}

function fillFinancialKraftfahrzeug(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
  attachment: Attachment,
) {
  const hasKraftfahrzeug = context.kraftfahrzeuge
    ? context.kraftfahrzeuge?.length > 0
    : false;
  pdfFields.f9Kraftfahrzeug1.value = !hasKraftfahrzeug;
  pdfFields.f9Kraftfahrzeuge2.value = hasKraftfahrzeug;

  if (context.kraftfahrzeuge && context.kraftfahrzeuge.length > 0) {
    if (context.kraftfahrzeuge.length == 1) {
      const kraftfahrzeug = context.kraftfahrzeuge.pop();

      pdfFields.f10KraftfahrzeugeA.value =
        kraftfahrzeug?.eigentuemer == "myself";
      pdfFields.f10KraftfahrzeugB.value =
        kraftfahrzeug?.eigentuemer == "partner";
      pdfFields.f10KraftfahrzeugC.value =
        kraftfahrzeug?.eigentuemer == "myselfAndPartner";

      pdfFields.f11Fahrzeugart.value =
        getKraftfahrzeugShortBezeichnung(kraftfahrzeug);
      pdfFields.f12Verkehrswert.value =
        kraftfahrzeug?.verkaufswert ?? "Keine Angaben";
    } else {
      pdfFields.f11Fahrzeugart.value = attachment.newPageHint;
      attachment.shouldCreateAttachment = true;
      const bezeichnung: string[] = [];

      context.kraftfahrzeuge.forEach((kraftfahrzeug) => {
        bezeichnung.push(
          getKraftfahrzeugBezeichnung(kraftfahrzeug, true).join("\n"),
        );
      });

      attachment.descriptions.unshift({
        title: "Kraftfahrzeuge",
        text: bezeichnung.join("\n\n"),
      });
    }
  }
}

function fillFinancialWertsachen(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
  attachment: Attachment,
) {
  const hasWertsachen = context.wertsachen
    ? context.wertsachen?.length > 0
    : false;
  pdfFields.f13Vermoegenswerte1.value = !hasWertsachen;
  pdfFields.f13Vermoegenswerte2.value = hasWertsachen;

  if (context.wertsachen) {
    if (context.wertsachen?.length == 1) {
      const wertsache = context.wertsachen.pop();
      pdfFields.f14InhaberA.value = wertsache?.eigentuemer == "myself";
      pdfFields.f14InhaberB.value = wertsache?.eigentuemer == "partner";
      pdfFields.f14VermoegenswerteC.value =
        wertsache?.eigentuemer == "myselfAndPartner";
      pdfFields.f15Bezeichnung.value =
        getWertsachenBezeichnung(wertsache).join(", ");
      pdfFields.f16RueckkaufswertoderVerkehrswertinEUR.value =
        wertsache?.wert ?? "Keine Angaben";
    } else {
      pdfFields.f15Bezeichnung.value = attachment.newPageHint;
      attachment.shouldCreateAttachment = true;

      const bezeichnung: string[] = [];

      context.wertsachen.forEach((wertsache) => {
        bezeichnung.push(getWertsachenBezeichnung(wertsache, true).join("\n"));
      });

      attachment.descriptions.unshift({
        title: "Wertsachen",
        text: bezeichnung.join("\n\n"),
      });
    }
  }
}

const wertsachenMapping = {
  cash: "Bargeld",
  valuableItem: "Wertgegenstand",
  digitalMoney: "Paypal- oder Kryprowährung",
  securities: "Wertpapiere, Aktien, Fonds",
  claim: "Forderung",
  equalizationOfGains: "Anspruch auf Zugewinnausgleich",
  other: "Sonstiges",
};

function getWertsachenBezeichnung(
  wertsachen:
    | {
        art:
          | "cash"
          | "valuableItem"
          | "digitalMoney"
          | "securities"
          | "claim"
          | "equalizationOfGains"
          | "other";
        eigentuemer:
          | "myself"
          | "partner"
          | "myselfAndPartner"
          | "myselfAndSomeoneElse";
        wert: string;
      }
    | undefined,
  hasMultipleWertsachen = false,
) {
  const bezeichnung = [];

  if (wertsachen?.art && wertsachenMapping[wertsachen?.art]) {
    bezeichnung.push(`${wertsachenMapping[wertsachen?.art]}`);
  }

  if (wertsachen?.eigentuemer && eigentuemerMapping[wertsachen?.eigentuemer]) {
    bezeichnung.push(
      `Eigentümer:in: ${eigentuemerMapping[wertsachen?.eigentuemer]}`,
    );
  }

  if (hasMultipleWertsachen && wertsachen?.wert) {
    bezeichnung.push(`Verkehrswert: ${wertsachen?.wert} €`);
  }

  return bezeichnung;
}

function getKraftfahrzeugShortBezeichnung(
  kraftfahrzeug:
    | {
        art: string;
        marke: string;
        eigentuemer:
          | "myself"
          | "partner"
          | "myselfAndPartner"
          | "myselfAndSomeoneElse";
        verkaufswert: string;
        kilometerstand: string;
        anschaffungsjahr: string;
        baujahr: string;
        bemerkung: string;
        arbeitsweg: string;
      }
    | undefined,
) {
  const bezeichnung = [];

  if (kraftfahrzeug?.art) {
    bezeichnung.push(`${kraftfahrzeug?.art}`);
  }

  if (kraftfahrzeug?.marke) {
    bezeichnung.push(`${kraftfahrzeug?.marke}`);
  }

  if (kraftfahrzeug?.baujahr) {
    bezeichnung.push(`Baujahr: ${kraftfahrzeug?.baujahr}`);
  }

  if (kraftfahrzeug?.kilometerstand) {
    bezeichnung.push(`km-Stand: ${kraftfahrzeug?.kilometerstand}`);
  }

  if (kraftfahrzeug?.arbeitsweg) {
    bezeichnung.push(`Wird für den Arbeitsweg gebraucht`);
  }

  return bezeichnung.join(", ");
}

function getKraftfahrzeugBezeichnung(
  kraftfahrzeug:
    | {
        art: string;
        marke: string;
        eigentuemer:
          | "myself"
          | "partner"
          | "myselfAndPartner"
          | "myselfAndSomeoneElse";
        verkaufswert: string;
        kilometerstand: string;
        anschaffungsjahr: string;
        baujahr: string;
        bemerkung: string;
        arbeitsweg: string;
      }
    | undefined,
  hasMultipleKraftfahrzeug = false,
) {
  const bezeichnung = [];

  if (kraftfahrzeug?.arbeitsweg === "on") {
    bezeichnung.push(`Fahrzeug wird für den Arbeitsweg genutzt`);
  }

  if (
    kraftfahrzeug?.eigentuemer &&
    eigentuemerMapping[kraftfahrzeug?.eigentuemer]
  ) {
    bezeichnung.push(
      `Eigentümer:in: ${eigentuemerMapping[kraftfahrzeug?.eigentuemer]}`,
    );
  }

  if (kraftfahrzeug?.art) {
    bezeichnung.push(`Art des Fahrzeugs: ${kraftfahrzeug?.art}`);
  }

  if (kraftfahrzeug?.marke) {
    bezeichnung.push(`Marke: ${kraftfahrzeug?.marke}`);
  }

  if (kraftfahrzeug?.anschaffungsjahr) {
    bezeichnung.push(`Anschaffungsjahr: ${kraftfahrzeug?.anschaffungsjahr}`);
  }

  if (kraftfahrzeug?.baujahr) {
    bezeichnung.push(`Baujahr: ${kraftfahrzeug?.baujahr} km`);
  }

  if (kraftfahrzeug?.kilometerstand) {
    bezeichnung.push(
      `Kilometerstand (ca.): ${kraftfahrzeug?.kilometerstand} km`,
    );
  }

  if (hasMultipleKraftfahrzeug && kraftfahrzeug?.verkaufswert) {
    bezeichnung.push(`Verkehrswert: ${kraftfahrzeug?.verkaufswert} €`);
  }

  return bezeichnung;
}

function getGrundeigentumBezeichnung(
  grundeigentum:
    | {
        eigentuemer:
          | "myself"
          | "partner"
          | "myselfAndPartner"
          | "myselfAndSomeoneElse";
        art:
          | "apartment"
          | "houseForFamily"
          | "houseWithMultipleApartments"
          | "property"
          | "hereditaryBuildingLaw";
        verkaufswert: string;
        flaeche: string;
        strassehausnummer: string;
        plz: string;
        ort: string;
        land: string;
      }
    | undefined,
  hasMultipleGrundeigentum = false,
) {
  const bezeichnung = [];
  const artMapping = {
    apartment: "Wohnung",
    houseForFamily: "Hauf für Familie",
    houseWithMultipleApartments: "Haus mit mehreren Wohnungen",
    property: "Grundstück",
    hereditaryBuildingLaw: "Erbbaurecht",
  };

  // Clearify if needed
  //bezeichnung.push(`Grundeigentum wird nicht vom Antragsteller bewohnt`);

  if (grundeigentum?.art) {
    bezeichnung.push(`Art des Eigentums: ${artMapping[grundeigentum.art]}`);
  }

  if (
    grundeigentum?.eigentuemer &&
    eigentuemerMapping[grundeigentum?.eigentuemer]
  ) {
    bezeichnung.push(
      `Eigentümer:in: ${eigentuemerMapping[grundeigentum?.eigentuemer]}`,
    );
  }

  if (grundeigentum?.flaeche) {
    bezeichnung.push(`Fläche: ${grundeigentum?.flaeche} m²`);
  }

  if (hasMultipleGrundeigentum && grundeigentum?.verkaufswert) {
    bezeichnung.push(`Verkehrswert: ${grundeigentum?.verkaufswert} €`);
  }

  return bezeichnung;
}

function getGrundeigentumBewohntBezeichnung(
  grundeigentum:
    | {
        eigentuemer:
          | "myself"
          | "partner"
          | "myselfAndPartner"
          | "myselfAndSomeoneElse";
        art:
          | "apartment"
          | "houseForFamily"
          | "houseWithMultipleApartments"
          | "property"
          | "hereditaryBuildingLaw";
        verkaufswert: string;
      }
    | undefined,
  hasMultipleGrundeigentum = false,
) {
  const bezeichnung = [];
  const artMapping = {
    apartment: "Wohnung",
    houseForFamily: "Hauf für Familie",
    houseWithMultipleApartments: "Haus mit mehreren Wohnungen",
    property: "Grundstück",
    hereditaryBuildingLaw: "Erbbaurecht",
  };

  //bezeichnung.push(`Grundeigentum ist der Hauptwohnsitz des Antragstellers`);

  if (grundeigentum?.art) {
    bezeichnung.push(`Art des Eigentums: ${artMapping[grundeigentum.art]}`);
  }

  if (
    grundeigentum?.eigentuemer &&
    eigentuemerMapping[grundeigentum?.eigentuemer]
  ) {
    bezeichnung.push(
      `Eigentümer:in: ${eigentuemerMapping[grundeigentum?.eigentuemer]}`,
    );
  }

  if (hasMultipleGrundeigentum && grundeigentum?.verkaufswert) {
    bezeichnung.push(`Verkehrswert: ${grundeigentum?.verkaufswert} €`);
  }

  return bezeichnung;
}

function getBankkontoBezeichnung(
  bankkonto:
    | {
        bankName: string;
        kontostand: string;
        iban: string;
        kontoEigentuemer:
          | "myself"
          | "partner"
          | "myselfAndPartner"
          | "myselfAndSomeoneElse";
      }
    | undefined,
  hasMultipleBankkonto = false,
) {
  const bezeichnung = [];

  if (bankkonto?.bankName) {
    bezeichnung.push(`Bank: ${bankkonto.bankName}`);
  }

  if (
    bankkonto?.kontoEigentuemer &&
    eigentuemerMapping[bankkonto?.kontoEigentuemer]
  ) {
    bezeichnung.push(
      `Eigentümer:in: ${eigentuemerMapping[bankkonto?.kontoEigentuemer]}`,
    );
  }

  if (hasMultipleBankkonto) {
    bezeichnung.push(
      `Kontostand: ${bankkonto?.kontostand ? bankkonto?.kontostand + " €" : "Keine Angabe"}`,
    );
  }

  return bezeichnung;
}
