import { renderToStream } from "@react-pdf/renderer";
import type {
  BeratungshilfePDF,
  StringField,
  BooleanField,
} from "./beratungshilfe.generated";
import { Convert } from "./beratungshilfe.generated";
import fs from "node:fs";
import path from "node:path";
import { type PDFForm, PDFDocument, PDFTextField, PDFCheckBox } from "pdf-lib";
import { normalizePropertyName } from "../pdf.server";
import FormAttachment from "~/components/FormAttachment";

import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { BeratungshilfeAntragContext } from "~/models/flows/beratungshilfeFormular";

const newPageHint = "Bitte im Anhang prüfen";

const isANewAttachmentPageNeeded = (
  context: BeratungshilfeAntragContext,
): Attachment => {
  const descriptions = [];

  if (context.bereich) {
    // TODO move to another function and use strapi as a source
    const bereichMapping = {
      authorities: "Behörden",
      living: "Wohnen",
      work: "Arbeit",
      separation: "Trennung & Unterhalt",
      trade: "Handel & Verträge",
      debt: "Schulden & Forderungen",
      inheritance: "Erben",
      criminalProcedure: "Strafverfahren",
      other: "Sonstiges",
    };

    descriptions.push({
      title: "Thema des Rechtsproblems:",
      text: bereichMapping[context.bereich],
    });
  }

  if (context.beschreibung) {
    descriptions.push({
      title: "Beschreibung Angelegenheit:",
      text: context.beschreibung,
    });
  }

  if (context.eigeninitiativeBeschreibung) {
    descriptions.push({
      title: "Eigenbemühungen:",
      text: context.eigeninitiativeBeschreibung,
    });
  } else if (context.keineEigeninitiativeBeschreibung) {
    descriptions.push({
      title: "Keine Eigenbemühung, weil:",
      text: context.keineEigeninitiativeBeschreibung,
    });
  }

  if (context.sonstiges) {
    descriptions.push({ title: "Weitere Anmerkung:", text: context.sonstiges });
  }

  return {
    shouldCreateNewPage:
      descriptions.map((x) => x.title + x.text).join(" ").length > 255,
    descriptions,
  };
};

type Attachment = {
  shouldCreateNewPage: boolean;
  descriptions: { title: string; text: string }[];
};

function getSelectedOptions(
  mapping: { [key: string]: string },
  options?: { [key: string]: CheckboxValue },
) {
  if (!options) {
    return "";
  }

  return Object.entries(options)
    .map(([key, value]) => {
      if (value === CheckboxValue.on) {
        return mapping[key];
      }
      return "";
    })
    .filter((entry) => entry)
    .join(", ");
}

const getOccupationDetails = (
  context: BeratungshilfeAntragContext,
  withAdditionalIncome = true,
) => {
  const description: string[] = [];

  if (context.erwerbstaetig === "no") {
    description.push("nicht erwerbstätig");
  } else if (context.berufart) {
    const occupation = "Erwerbstätig";
    const occupationTypeSelected = getSelectedOptions(
      {
        selbststaendig: "selbstständig",
        festangestellt: "festangestellt",
      },
      context.berufart,
    );

    description.push(
      `${occupation}${
        occupationTypeSelected ? " (" + occupationTypeSelected + ")" : ""
      }`,
    );
  }

  const berufsituationMapping = {
    no: "",
    pupil: "Schüler:in",
    student: "Student:in",
    retiree: "Rentner:in",
  };

  description.push(berufsituationMapping[context.berufsituation ?? "no"]);

  if (context.weitereseinkommen && withAdditionalIncome) {
    const otherIncomes = getSelectedOptions(
      {
        unterhaltszahlungen: "Unterhaltszahlungen",
        wohngeld: "Wohngeld",
        kindergeld: "Kindergeld",
        bafoeg: "Bafög",
        others: "Sonstiges",
      },
      context.weitereseinkommen,
    );

    description.push(otherIncomes);
  }

  return description.filter((value) => value).join(", ");
};

export async function getBeratungshilfePdfFromContext(
  context: BeratungshilfeAntragContext,
) {
  const pdfFields = await getBeratungshilfeParameters();

  if (!pdfFields) {
    throw new Error("No pdf fields or file found for beratungshilfe!");
  }

  const hasStaatlicheLeistung =
    context.staatlicheLeistungen != "andereLeistung" &&
    context.staatlicheLeistungen != "keine";
  const staatlicheLeistungMapping = {
    grundsicherung: "Grundsicherung",
    asylbewerberleistungen: "Asylbewerberleistungen",
    buergergeld: "Bürgergeld",
    andereLeistung: "Andere Leistung",
    keine: "Keine",
  };

  fillCommonPDFFields(pdfFields, context);

  fillPersonalData(
    context,
    pdfFields,
    hasStaatlicheLeistung,
    staatlicheLeistungMapping,
  );

  const attachment = isANewAttachmentPageNeeded(context);
  if (attachment.shouldCreateNewPage) {
    pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
      newPageHint;
  } else {
    pdfFields.ichbeantrageBeratungshilfeinfolgenderAngelegenheitbitteSachverhaltkurzerlaeutern.value =
      attachment.descriptions.map((x) => `${x.title} ${x.text} `).join("\n");
  }

  if (
    !hasStaatlicheLeistung &&
    (pdfFields.berufErwerbstaetigkeit.value?.length ?? 0) > 30
  ) {
    attachment.shouldCreateNewPage = true;
    attachment.descriptions.unshift({
      title: "Weiteres Einkommen:",
      text: getSelectedOptions(
        {
          unterhaltszahlungen: "Unterhaltszahlungen",
          wohngeld: "Wohngeld",
          kindergeld: "Kindergeld",
          bafoeg: "Bafög",
          others: "Sonstiges",
        },
        context.weitereseinkommen ?? {},
      ),
    });
    attachment.descriptions.unshift({
      title: "Beruf / Erwerbstätigkeit:",
      text: getOccupationDetails(context, false),
    });
    pdfFields.berufErwerbstaetigkeit.value = newPageHint;
  }

  fillFinancial(pdfFields, context, attachment);

  fillPartner(context, pdfFields);

  fillBeratungsperson(pdfFields, context);

  return fillOutBeratungshilfe(
    pdfFields,
    attachment.descriptions,
    attachment.shouldCreateNewPage,
  );
}

function fillCommonPDFFields(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeAntragContext,
) {
  pdfFields.bIndervorliegendenAngelegenheittrittkeineRechtsschutzversicherungein.value =
    context.rechtsschutzversicherung === "no";
  pdfFields.b3IndieserAngelegenheitistmirbisherBeratungshilfewederbewilligtnochversagtworden.value =
    context.beratungshilfeBeantragt === "no";
  pdfFields.b2IndieserAngelegenheitbestehtfurmichnachmeinerKenntniskeineandereMoeglichkeitkostenloseBeratungundVertretunginAnspruchzunehmen.value =
    context.eigeninitiativeGrundvorraussetzung === "no";
  pdfFields.b4IndieserAngelegenheitwirdoderwurdevonmirbisherkeingerichtlichesVerfahrengefuhrt.value =
    context.klageEingereicht === "no";
  pdfFields.c2Einkuenftenetto.value = context.einkommen;
}

function fillPartner(
  context: BeratungshilfeAntragContext,
  pdfFields: BeratungshilfePDF,
) {
  if (
    context.partnerschaft === "yes" &&
    context.zusammenleben === "yes" &&
    context.partnerEinkommen === "yes"
  ) {
    pdfFields.c3EinkuenftePartner.value = true;
    pdfFields.c4EinkuenftePartnernetto.value = context.partnerEinkommenSumme;
  } else if (
    context.partnerschaft === "yes" &&
    context.zusammenleben === "no" &&
    context.unterhalt === "yes"
  ) {
    pdfFields.e1Person1.value = [
      context.partnerVorname ?? "",
      context.partnerNachname ?? "",
    ].join(" ");
    pdfFields.e3Familienverhaeltnis.value = "Partner:in";
    pdfFields.e4Zahlung1.value = context.unterhaltsSumme;
  }
}

function fillPersonalData(
  context: BeratungshilfeAntragContext,
  {
    anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers,
    antragstellerNameVornameggfGeburtsname,
    berufErwerbstaetigkeit,
    geburtsdatumdesAntragstellers,
    tagsueberTelefonischerreichbarunterNummer,
  }: BeratungshilfePDF,
  hasStaatlicheLeistung: boolean,
  staatlicheLeistungMapping: {
    grundsicherung: string;
    asylbewerberleistungen: string;
    buergergeld: string;
    andereLeistung: string;
    keine: string;
  },
) {
  antragstellerNameVornameggfGeburtsname.value = [
    context.nachname,
    context.vorname,
  ]
    .filter((entry) => entry)
    .join(", ");
  geburtsdatumdesAntragstellers.value = context.geburtsdatum;
  anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers.value = [
    context.strasseHausnummer,
    context.plz,
    context.ort,
  ]
    .filter((entry) => entry)
    .join(", ");
  tagsueberTelefonischerreichbarunterNummer.value = context.telefonnummer;
  berufErwerbstaetigkeit.value = hasStaatlicheLeistung
    ? staatlicheLeistungMapping[context.staatlicheLeistungen ?? "keine"]
    : getOccupationDetails(context);
}

function fillFinancial(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeAntragContext,
  attachment: Attachment,
) {
  fillFinancialBankkonto(pdfFields, context, attachment);
  fillFinancialGrundeigentum(pdfFields, context, attachment);
  fillFinancialKraftfahrzeug(pdfFields, context, attachment);
  fillFinancialWertsachen(pdfFields, context, attachment);
}

const eigentuemerMapping = {
  myself: "Ich alleine",
  partner: "Ehe-Partner:in",
  myselfAndPartner: "Mein:e Ehe-Partner:in und ich gemeinsam",
  myselfAndSomeoneElse: "Ich gemeinsam mit jemand anderem",
};

function fillFinancialBankkonto(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeAntragContext,
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
      pdfFields.f3Bank1.value = newPageHint;
      attachment.shouldCreateNewPage = true;
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
  context: BeratungshilfeAntragContext,
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
    console.log(
      context.grundeigentumBewohnt !== undefined ||
        context.grundeigentum !== undefined,
    );

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

    pdfFields.f7Nutzungsart.value = newPageHint;
    attachment.shouldCreateNewPage = true;
    attachment.descriptions.unshift({
      title: "Grundeigentum",
      text: bezeichnung.join("\n\n"),
    });
  }
}

function fillFinancialKraftfahrzeug(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeAntragContext,
  attachment: Attachment,
) {
  const hasKraftfahrzeug = context.bankkonten
    ? context.bankkonten?.length > 0
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
      pdfFields.f11Fahrzeugart.value = newPageHint;
      attachment.shouldCreateNewPage = true;
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
  context: BeratungshilfeAntragContext,
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
      pdfFields.f15Bezeichnung.value = newPageHint;
      attachment.shouldCreateNewPage = true;

      const bezeichnung: string[] = [];

      context.wertsachen.forEach((wertsache) => {
        bezeichnung.push(getWertsachenBezeichnung(wertsache, true).join("\n"));
      });

      attachment.descriptions.unshift({
        title: "Wertsachen",
        text: bezeichnung.join("\n"),
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

  if (kraftfahrzeug?.arbeitsweg) {
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
    bezeichnung.push(`Art des Fahrzeugs:: ${kraftfahrzeug?.art}`);
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

  bezeichnung.push(`Grundeigentum wird nicht vom Antragsteller bewohnt`);

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

  bezeichnung.push(`Grundeigentum ist der Hauptwohnsitz des Antragstellers`);

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

function fillBeratungsperson(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeAntragContext,
) {
  const address = [
    context.anwaltName ?? "",
    context.anwaltStrasseUndHausnummer ?? "",
    context.anwaltPlz ?? "",
    context.anwaltOrt ?? "",
  ]
    .filter((entry) => entry)
    .join(", ");

  pdfFields.beratungsperson.value = address;
  pdfFields.datumBeratung.value = context.beratungStattgefundenDatum;
}

async function getBeratungshilfeParameters() {
  const json: { [key: string]: StringField | BooleanField } = {};
  await PDFDocument.load(getBeratungshilfePdfBuffer()).then((pdfDoc) => {
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    fields.forEach((field) => {
      const fieldName = normalizePropertyName(field.getName());

      const textField = field as PDFTextField;
      if (field instanceof PDFTextField) {
        json[fieldName] = {
          name: field.getName(),
          value: textField.getText(),
        } as StringField;
      }

      const booleanField = field as PDFCheckBox;
      if (field instanceof PDFCheckBox) {
        json[fieldName] = {
          name: field.getName(),
          value: booleanField.isChecked(),
        } as BooleanField;
      }
    });
  });

  return Convert.toBeratungshilfePDF(JSON.stringify(json));
}

async function handleOutOfLimitDescription(
  descriptions: { title: string; text: string }[],
  pdfDoc: PDFDocument,
) {
  const stream = await renderToStream(
    <FormAttachment descriptions={descriptions} />,
  );

  const PDFAttachmentAsBuffer: Buffer = await new Promise((resolve, reject) => {
    const buffers: Uint8Array[] = [];
    stream.on("data", (data: Uint8Array) => {
      buffers.push(data);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
    stream.on("error", reject);
  });

  const PDFAttachment = await PDFDocument.load(PDFAttachmentAsBuffer);
  const pages = PDFAttachment.getPages();

  for (let index = 0; index < pages.length; index++) {
    const [PDFAttachmentAsCopy] = await pdfDoc.copyPages(PDFAttachment, [
      index,
    ]);
    pdfDoc.insertPage(3 + index, PDFAttachmentAsCopy);
  }
  return pdfDoc.save();
}

async function fillOutBeratungshilfe(
  values: BeratungshilfePDF,
  descriptions: { title: string; text: string }[],
  shouldCreateNewPage: boolean,
) {
  return await PDFDocument.load(getBeratungshilfePdfBuffer()).then((pdfDoc) => {
    const form = pdfDoc.getForm();

    Object.entries(values).forEach(([, value]) => {
      // When value is a BooleanField
      const booleanField = value as BooleanField;
      if (!changeBooleanField(booleanField, form)) {
        // When value is a StringField
        const stringField = value as StringField;
        changeStringField(stringField, form);
      }
    });

    if (shouldCreateNewPage) {
      return handleOutOfLimitDescription(descriptions, pdfDoc);
    }

    return pdfDoc.save();
  });
}

function changeBooleanField(field: BooleanField, form: PDFForm) {
  // When value is a BooleanField
  const booleanField = field;
  if (booleanField) {
    const field = form.getField(booleanField.name ?? "");
    if (field instanceof PDFCheckBox) {
      const checkBox = field;
      checkBox.uncheck();
      if (booleanField.value) {
        checkBox.check();
      }
      return true;
    }
  }
  return false;
}

function changeStringField(field: StringField, form: PDFForm) {
  const stringField = field;
  if (stringField) {
    const field = form.getField(stringField.name ?? "");
    if (field instanceof PDFTextField) {
      const textField = field;
      if (textField) {
        textField.setText(stringField.value);
        textField.setFontSize(10);
        return true;
      }
    }
  }
  return false;
}

// Caching file read, decryption & parsing to survive server reload
// See https://remix.run/docs/en/1.16.1/tutorials/jokes#connect-to-the-database
declare global {
  // eslint-disable-next-line no-var
  var __beratungshilfeBuffer: ArrayBuffer | undefined; // NOSONAR
}

// Singleton to prevent multiple file reads
function getBeratungshilfePdfBuffer(): ArrayBuffer {
  if (!global.__beratungshilfeBuffer) {
    try {
      const file = path.resolve(
        path.join(
          process.cwd(),
          "app/services/pdf/beratungshilfe/Antrag_auf_Bewilligung_von_Beratungshilfe.pdf",
        ),
      );
      global.__beratungshilfeBuffer = fs.readFileSync(file);
    } catch (error) {
      console.error(error);
      return ArrayBuffer.prototype;
    }
  }

  return global.__beratungshilfeBuffer ?? ArrayBuffer.prototype;
}
