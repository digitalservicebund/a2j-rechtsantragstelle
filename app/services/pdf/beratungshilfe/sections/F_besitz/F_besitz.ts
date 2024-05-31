import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { fillKraftfahrzeug } from "./fillKraftfahrzeug";
import type { Attachment } from "../../attachment";
import { newPageHint } from "../../attachment";

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
      title: "Feld F Eigentum",
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
  const { hasBankkonto, bankkonten, eigentumTotalWorth } = context;
  const hasBankkontoYes = hasBankkonto === "yes";

  pdfFields.f1Konten1.value = !hasBankkontoYes;
  pdfFields.f1Konten2.value = hasBankkontoYes;
  if (!hasBankkontoYes || !bankkonten || bankkonten.length === 0) return;

  pdfFields.f3Bank1.value =
    eigentumTotalWorth === "less10000"
      ? "Übergreifender Hinweis zu allen Vermögenswerten:\nMein gesamtes Vermögen ist insgesamt weniger als 10.000€ wert.\n\n"
      : "";

  if (bankkonten.length == 1) {
    const bankkonto = bankkonten.pop();

    pdfFields.f1InhaberA.value = bankkonto?.kontoEigentuemer == "myself";
    pdfFields.f2InhaberB.value = bankkonto?.kontoEigentuemer == "partner";
    pdfFields.f2InhaberC.value =
      bankkonto?.kontoEigentuemer == "myselfAndPartner";

    const bezeichnung = getBankkontoBezeichnung(bankkonto);

    pdfFields.f3Bank1.value += bezeichnung.join(", ");
    pdfFields.f4Kontostand.value = `${bankkonto?.kontostand ?? ""} €`;
  } else {
    attachment.shouldCreateAttachment = true;
    const bezeichnung: string[] = [];

    bankkonten.forEach((bankkonto) => {
      bezeichnung.push(getBankkontoBezeichnung(bankkonto, true).join("\n"));
    });

    pdfFields.f3Bank1.value += newPageHint;

    attachment.descriptions.unshift({
      title: "Bankkonten",
      text: bezeichnung.join("\n\n"),
    });
  }
}

export function fillFinancialGrundeigentum(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const { hasGrundeigentum, grundeigentum: grundeigentumArray } = context;
  const hasGrundeigentumYes = hasGrundeigentum === "yes";
  pdfFields.f5Grundeigentum1.value = !hasGrundeigentumYes;
  pdfFields.f5Grundeigentum2.value = hasGrundeigentumYes;

  if (
    !hasGrundeigentumYes ||
    !grundeigentumArray ||
    grundeigentumArray.length === 0
  )
    return;

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
  const { hasWertsache, wertsachen } = context;
  const hasWertsacheYes = hasWertsache === "yes";
  pdfFields.f13Vermoegenswerte1.value = !hasWertsacheYes;
  pdfFields.f13Vermoegenswerte2.value = hasWertsacheYes;

  if (!hasWertsacheYes || !wertsachen || wertsachen.length === 0) return;

  if (wertsachen?.length == 1) {
    const wertsache = wertsachen.pop();
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

    wertsachen.forEach((wertsache) => {
      bezeichnung.push(getWertsachenBezeichnung(wertsache, true).join("\n"));
    });

    attachment.descriptions.unshift({
      title: "Wertsachen",
      text: bezeichnung.join("\n\n"),
    });
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

  if (bankkonto?.kontoDescription)
    bezeichnung.push(`Bezeichnung: ${bankkonto?.kontoDescription}`);

  return bezeichnung;
}

const geldanlageArtMapping = {
  bargeld: "Bargeld",
  wertpapiere: "Wertpapiere",
  guthabenkontoKrypto: "Guthabenkonto oder Kryptowährung",
  giroTagesgeldSparkonto: "Girokonto / Tagesgeld / Sparkonto",
  befristet: "Befristete Geldanlage",
  forderung: "Forderung",
  sonstiges: "Sonstiges",
} as const;

type Geldanlage = NonNullable<BeratungshilfeFormularContext["geldanlagen"]>[0];
function getGeldanlagenBezeichnung(geldanlagen?: Geldanlage[]): string[] {
  const bezeichnung: string[] = [];

  const giroTagesgeldSparkonto = (anlage: Geldanlage) => {
    bezeichnung.push(`Name der Bank: ${anlage.kontoBankName ?? ""}`);
    if (anlage.kontoIban && (anlage.kontoIban?.length ?? 0) > 0)
      bezeichnung.push(`IBAN: ${anlage.kontoIban}`);
    if (anlage.kontoBezeichnung && (anlage.kontoBezeichnung?.length ?? 0) > 0)
      bezeichnung.push(`Bezeichnung: ${anlage.kontoBezeichnung}`);
  };

  const befristet = (anlage: Geldanlage) => {
    bezeichnung.push(`Verwendungszweck: ${anlage.verwendungszweck ?? ""}`);
    bezeichnung.push(`Auszahlungstermin: ${anlage.auszahlungdatum ?? ""}`);
  };

  const sonstiges = (anlage: Geldanlage) => {
    bezeichnung.push(`Beschreibung: ${anlage.verwendungszweck ?? ""}`);
  };

  const forderung = (anlage: Geldanlage) => {
    bezeichnung.push(`Forderung: ${anlage.forderung ?? ""}`);
    bezeichnung.push(`Wer fordert: ${eigentuemerMapping[anlage.eigentuemer]}`);
  };

  geldanlagen?.forEach((geldanlage, index) => {
    // Create a new line for each entry
    bezeichnung.push("");

    bezeichnung.push(`Geldanlage ${index + 1}`);
    bezeichnung.push(
      `Art der Geldanlage: ${geldanlageArtMapping[geldanlage.art]}`,
    );

    switch (geldanlage.art) {
      case "giroTagesgeldSparkonto": {
        giroTagesgeldSparkonto(geldanlage);
        break;
      }
      case "befristet": {
        befristet(geldanlage);
        break;
      }
      case "sonstiges": {
        sonstiges(geldanlage);
        break;
      }
      case "forderung": {
        forderung(geldanlage);
        break;
      }
    }

    if (geldanlage.art !== "forderung") {
      bezeichnung.push(
        `Eigentümer:in: ${eigentuemerMapping[geldanlage.eigentuemer]}`,
      );
    }

    bezeichnung.push(`Wert: ${geldanlage.wert} €`);
  });

  return bezeichnung;
}
