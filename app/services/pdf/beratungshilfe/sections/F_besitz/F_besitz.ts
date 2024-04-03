import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { Attachment } from "../../attachment";
import { newPageHint } from "../../attachment";
import { fillKraftfahrzeug } from "./fillKraftfahrzeug";

export function fillBesitz(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const financialAttachment: Attachment = {
    descriptions: [],
    shouldCreateAttachment: false,
  };

  fillFinancialBankkonto(financialAttachment, pdfFields, context);
  fillFinancialGrundeigentum(financialAttachment, pdfFields, context);
  fillKraftfahrzeug(financialAttachment, pdfFields, context);
  fillFinancialWertsachen(financialAttachment, pdfFields, context);
  fillGeldanlagen(financialAttachment, pdfFields, context);

  if (financialAttachment.shouldCreateAttachment) {
    financialAttachment.descriptions.unshift({
      title: "F Bankkonten/Grundeigentum/Kraftfahrzeuge/Bargeld/Vermögenswerte",
      text: "",
    });

    attachment.shouldCreateAttachment = true;
    attachment.descriptions = attachment.descriptions.concat(
      financialAttachment.descriptions,
    );
  }
}

export const eigentuemerMapping = {
  myself: "Ich alleine",
  partner: "Ehe-Partner:in",
  myselfAndPartner: "Mein:e Ehe-Partner:in und ich gemeinsam",
  myselfAndSomeoneElse: "Ich gemeinsam mit jemand anderem",
} as const;

export function fillFinancialBankkonto(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
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
      pdfFields.f4Kontostand.value = `${bankkonto?.kontostand ?? ""} €`;
    } else {
      attachment.shouldCreateAttachment = true;
      const bezeichnung: string[] = [];

      context.bankkonten.forEach((bankkonto) => {
        bezeichnung.push(getBankkontoBezeichnung(bankkonto, true).join("\n"));
      });

      pdfFields.f3Bank1.value = newPageHint;

      attachment.descriptions.unshift({
        title: "Bankkonten",
        text: bezeichnung.join("\n\n"),
      });
    }
  }
}

export function fillFinancialGrundeigentum(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const { hasGrundeigentum, grundeigentum: grundeigentumArray } = context;
  const validGrundEigentum =
    hasGrundeigentum === "yes" &&
    grundeigentumArray &&
    grundeigentumArray.length > 0;

  pdfFields.f5Grundeigentum1.value = !validGrundEigentum;
  pdfFields.f5Grundeigentum2.value = validGrundEigentum;
  if (!validGrundEigentum) return;

  if (grundeigentumArray.length === 1) {
    const grundeigentum = grundeigentumArray[0];

    pdfFields.f1InhaberA.value = grundeigentum.eigentuemer == "myself";
    pdfFields.f2InhaberB.value = grundeigentum.eigentuemer == "partner";
    pdfFields.f2InhaberC.value =
      grundeigentum.eigentuemer == "myselfAndPartner";
    pdfFields.f8Verkehrswert.value = grundeigentum.verkaufswert
      ? `${grundeigentum.verkaufswert} €`
      : "Keine Angaben";

    pdfFields.f7Nutzungsart.value =
      getGrundeigentumBezeichnung(grundeigentum).join(", ");
  } else {
    pdfFields.f7Nutzungsart.value = newPageHint;
    attachment.shouldCreateAttachment = true;
    attachment.descriptions.unshift({
      title: "Grundeigentum",
      text: grundeigentumArray
        .map((grundeigentum) =>
          getGrundeigentumBezeichnung(grundeigentum, true).join("\n"),
        )
        .join("\n\n"),
    });
  }
}

export function fillFinancialWertsachen(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
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

export function fillGeldanlagen(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  if (context.geldanlagen && context.geldanlagen.length > 0) {
    pdfFields.f13Vermoegenswerte1.value = false;
    pdfFields.f13Vermoegenswerte2.value = true;
    pdfFields.f15Bezeichnung.value = newPageHint;

    const attachmentDescription = getGeldanlagenBezeichnung(
      context.geldanlagen,
    ).join("\n");
    attachment.descriptions.unshift({
      title: "Geldanlagen",
      text: attachmentDescription,
    });
    attachment.shouldCreateAttachment = true;
  }
}

type Wertsache = NonNullable<BeratungshilfeFormularContext["wertsachen"]>[0];

function getWertsachenBezeichnung(
  wertsache?: Wertsache,
  hasMultipleWertsachen = false,
) {
  const bezeichnung = [];

  if (wertsache?.art) {
    bezeichnung.push(wertsache?.art);
  }

  if (wertsache?.eigentuemer && eigentuemerMapping[wertsache?.eigentuemer]) {
    bezeichnung.push(
      `Eigentümer:in: ${eigentuemerMapping[wertsache?.eigentuemer]}`,
    );
  }

  if (hasMultipleWertsachen && wertsache?.wert) {
    bezeichnung.push(`Verkehrswert: ${wertsache?.wert} €`);
  }

  return bezeichnung;
}

type Grundeigentum = NonNullable<
  BeratungshilfeFormularContext["grundeigentum"]
>[0];

function getGrundeigentumBezeichnung(
  grundeigentum: Grundeigentum,
  hasMultipleGrundeigentum = false,
) {
  const bezeichnung = [];
  const artMapping = {
    eigentumswohnung: "Wohnung",
    einfamilienhaus: "Haus für Familie",
    mehrereWohnungen: "Haus mit mehreren Wohnungen",
    unbebaut: "Grundstück",
    erbbaurecht: "Erbbaurecht",
    garage: "Garagen(-hof)",
  };

  if (grundeigentum.art) {
    bezeichnung.push(`Art des Eigentums: ${artMapping[grundeigentum.art]}`);
  }

  if (
    grundeigentum.eigentuemer &&
    eigentuemerMapping[grundeigentum.eigentuemer]
  ) {
    bezeichnung.push(
      `Eigentümer:in: ${eigentuemerMapping[grundeigentum.eigentuemer]}`,
    );
  }

  if (grundeigentum.flaeche) {
    bezeichnung.push(`Fläche: ${grundeigentum.flaeche} m²`);
  }

  if (hasMultipleGrundeigentum && grundeigentum.verkaufswert) {
    bezeichnung.push(`Verkehrswert: ${grundeigentum.verkaufswert} €`);
  }
  if (grundeigentum.isBewohnt === "yes") bezeichnung.push("Eigennutzung");

  return bezeichnung;
}

type Bankkonto = NonNullable<BeratungshilfeFormularContext["bankkonten"]>[0];

function getBankkontoBezeichnung(
  bankkonto?: Bankkonto,
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

const geldanlageArtMapping = {
  bargeld: "Bargeld",
  wertpapiere: "Wertpapiere",
  guthabenkontoKrypto: "Paypal oder Crypto",
  giroTagesgeldSparkonto: "Girokonto / Tagesgeld / Sparkonto",
  befristet: "Befristete Geldanlage",
  forderung: "Forderung",
  sonstiges: "Sonstiges",
} as const;

type Geldanlage = NonNullable<BeratungshilfeFormularContext["geldanlagen"]>[0];
function getGeldanlagenBezeichnung(geldanlagen?: Geldanlage[]): string[] {
  const bezeichnung: string[] = [];

  geldanlagen?.forEach((geldanlage, index) => {
    // Create a new line for each entry
    bezeichnung.push("");

    bezeichnung.push(`Geldanlage ${index + 1}`);
    bezeichnung.push(
      `Art der Geldanlage: ${geldanlageArtMapping[geldanlage.art]}`,
    );
    bezeichnung.push(`Betrag: ${geldanlage.wert} €`);
    bezeichnung.push(
      `Eigentümer:in: ${eigentuemerMapping[geldanlage.eigentuemer]}`,
    );

    if (geldanlage.art === "giroTagesgeldSparkonto") {
      bezeichnung.push(`Name der Bank: ${geldanlage.kontoBankName ?? ""}`);
      if (geldanlage.kontoIban && (geldanlage.kontoIban?.length ?? 0) > 0)
        bezeichnung.push(`IBAN: ${geldanlage.kontoIban}`);
      if (
        geldanlage.kontoBezeichnung &&
        (geldanlage.kontoBezeichnung?.length ?? 0) > 0
      )
        bezeichnung.push(`Bezeichnung: ${geldanlage.kontoBezeichnung}`);
    }

    if (geldanlage.art === "befristet") {
      bezeichnung.push(
        `Verwendungszweck: ${geldanlage.verwendungszweck ?? ""}`,
      );
      bezeichnung.push(
        `Auszahlungstermin: ${geldanlage.auszahlungdatum ?? ""}`,
      );
    }

    if (geldanlage.art === "sonstiges") {
      bezeichnung.push(`Beschreibung: ${geldanlage.verwendungszweck ?? ""}`);
    }
  });

  return bezeichnung;
}
