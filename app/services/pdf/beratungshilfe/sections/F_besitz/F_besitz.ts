import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { arrayIsNonEmpty } from "~/util/array";
import { fillKraftfahrzeug } from "./fillKraftfahrzeug";
import type { AttachmentEntries } from "../../../attachment";
import { newPageHint } from "../../../attachment";
import { eigentuemerMapping } from "../../eigentuemerMapping";

export function fillBesitz(
  attachment: AttachmentEntries,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const financialAttachment: AttachmentEntries = [];

  fillFinancialBankkonto(financialAttachment, pdfFields, context);
  fillFinancialGrundeigentum(financialAttachment, pdfFields, context);
  fillKraftfahrzeug(financialAttachment, pdfFields, context);
  fillFinancialWertsachen(financialAttachment, pdfFields, context);
  fillGeldanlagen(financialAttachment, pdfFields, context);

  if (financialAttachment.length > 0) {
    attachment.push({
      title: "Feld F: Eigentum",
      level: "h2",
    });

    financialAttachment.forEach((entry) => {
      attachment.push(entry);
    });
  }
}

export function fillFinancialBankkonto(
  attachment: AttachmentEntries,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const { bankkonten, eigentumTotalWorth } = context;
  const hasBankkontoYes = arrayIsNonEmpty(bankkonten);

  pdfFields.f1Konten1.value = !hasBankkontoYes;
  pdfFields.f1Konten2.value = hasBankkontoYes;
  if (!hasBankkontoYes) return;

  pdfFields.f3Bank1.value =
    eigentumTotalWorth === "less10000"
      ? "Übergreifender Hinweis zu allen Vermögenswerten:\nMein gesamtes Vermögen ist insgesamt weniger als 10.000€ wert.\n\n"
      : "";

  if (bankkonten.length == 1) {
    const bankkonto = bankkonten[0];
    pdfFields.f1InhaberA.value = bankkonto.kontoEigentuemer == "myself";
    pdfFields.f2InhaberB.value = bankkonto.kontoEigentuemer == "partner";
    pdfFields.f2InhaberC.value =
      bankkonto.kontoEigentuemer == "myselfAndPartner";

    pdfFields.f3Bank1.value += `Bank: ${bankkonto.bankName}`;
    if (bankkonto.kontoDescription)
      pdfFields.f3Bank1.value += `\nBezeichnung: ${bankkonto.kontoDescription}`;
    if (bankkonto.kontoEigentuemer === "myselfAndSomeoneElse")
      pdfFields.f3Bank1.value += `\nInhaber: ${eigentuemerMapping[bankkonto.kontoEigentuemer]}`;

    pdfFields.f4Kontostand.value = bankkonto.kontostand + " €";
  } else {
    attachment.push({
      title: "Bankkonten",
      level: "h3",
    });

    bankkonten.forEach(
      (
        { bankName, kontoEigentuemer, kontostand, kontoDescription, iban },
        index,
      ) => {
        attachment.push(
          { title: `Bankkonto ${index + 1}`, level: "h4" },
          { title: "Bank", text: bankName },
          { title: "Inhaber", text: eigentuemerMapping[kontoEigentuemer] },
          { title: "Kontostand", text: kontostand + " €" },
        );

        if (kontoDescription)
          attachment.push({ title: "Beschreibung", text: kontoDescription });
        if (iban) attachment.push({ title: "Iban", text: iban });
      },
    );

    pdfFields.f3Bank1.value += newPageHint;
  }
}

export function fillFinancialGrundeigentum(
  attachment: AttachmentEntries,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const { grundeigentum: grundeigentumArray } = context;
  const hasGrundeigentumYes = arrayIsNonEmpty(grundeigentumArray);
  pdfFields.f5Grundeigentum1.value = !hasGrundeigentumYes;
  pdfFields.f5Grundeigentum2.value = hasGrundeigentumYes;

  if (!hasGrundeigentumYes) return;

  const grundeigentumArtMapping = {
    eigentumswohnung: "Wohnung",
    einfamilienhaus: "Haus für Familie",
    mehrereWohnungen: "Haus mit mehreren Wohnungen",
    unbebaut: "Grundstück",
    erbbaurecht: "Erbbaurecht",
    garage: "Garagen(-hof)",
  } as const;

  if (grundeigentumArray.length === 1) {
    const grundeigentum = grundeigentumArray[0];

    pdfFields.f6EigentuemerA.value = grundeigentum.eigentuemer == "myself";
    pdfFields.f6EigentuemerB.value = grundeigentum.eigentuemer == "partner";
    pdfFields.f6EigentuemerC.value =
      grundeigentum.eigentuemer == "myselfAndPartner";

    pdfFields.f7Nutzungsart.value = `Art: ${grundeigentumArtMapping[grundeigentum.art]}`;
    if (grundeigentum.isBewohnt === "yes")
      pdfFields.f7Nutzungsart.value += ", Eigennutzung";
    else if (grundeigentum.isBewohnt === "family")
      pdfFields.f7Nutzungsart.value += ", Bewohnt von Familie";

    pdfFields.f7Nutzungsart.value += `, Fläche: ${grundeigentum.flaeche} m²`;

    if (grundeigentum.eigentuemer === "myselfAndSomeoneElse")
      pdfFields.f7Nutzungsart.value += `, Eigentümer: ${eigentuemerMapping[grundeigentum.eigentuemer]}`;

    pdfFields.f8Verkehrswert.value = grundeigentum.verkaufswert + " €";
  } else {
    pdfFields.f7Nutzungsart.value = newPageHint;
    attachment.push({
      title: "Grundeigentum",
      level: "h3",
    });

    grundeigentumArray.forEach((grundeigentum, index) => {
      attachment.push(
        { title: `Grundeigentum ${index + 1}`, level: "h4" },
        {
          title: "Art",
          text: grundeigentumArtMapping[grundeigentum.art],
        },
        {
          title: "Eigentümer:in",
          text: eigentuemerMapping[grundeigentum.eigentuemer],
        },
        { title: "Fläche", text: grundeigentum.flaeche + " m²" },
        { title: "Verkehrswert", text: grundeigentum.verkaufswert + " €" },
      );
      if (grundeigentum.isBewohnt === "yes")
        attachment.push({ title: "Eigennutzung", text: "Ja" });
      else if (grundeigentum.isBewohnt === "family")
        attachment.push({ title: "Eigennutzung", text: "Von Familie" });
    });
  }
}

export function fillFinancialWertsachen(
  attachment: AttachmentEntries,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const { wertsachen } = context;
  const hasWertsacheYes = arrayIsNonEmpty(wertsachen);
  pdfFields.f13Vermoegenswerte1.value = !hasWertsacheYes;
  pdfFields.f13Vermoegenswerte2.value = hasWertsacheYes;

  if (!hasWertsacheYes) return;

  if (wertsachen?.length == 1) {
    const wertsache = wertsachen[0];
    pdfFields.f14InhaberA.value = wertsache.eigentuemer == "myself";
    pdfFields.f14InhaberB.value = wertsache.eigentuemer == "partner";
    pdfFields.f14VermoegenswerteC.value =
      wertsache.eigentuemer == "myselfAndPartner";

    pdfFields.f15Bezeichnung.value = wertsache.art;
    if (wertsache.eigentuemer === "myselfAndSomeoneElse")
      pdfFields.f15Bezeichnung.value += `\nEigentümer:in: ${eigentuemerMapping[wertsache.eigentuemer]}`;

    pdfFields.f16RueckkaufswertoderVerkehrswertinEUR.value = wertsache.wert;
  } else {
    pdfFields.f15Bezeichnung.value = newPageHint;
    const bezeichnung: string[] = [];

    wertsachen.forEach((wertsache) => {
      bezeichnung.push(getWertsachenBezeichnung(wertsache, true).join("\n"));
    });

    attachment.unshift({
      title: "Wertsachen",
      text: bezeichnung.join("\n\n"),
    });
  }
}

export function fillGeldanlagen(
  attachment: AttachmentEntries,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  if (arrayIsNonEmpty(context.geldanlagen)) {
    pdfFields.f13Vermoegenswerte1.value = false;
    pdfFields.f13Vermoegenswerte2.value = true;
    pdfFields.f15Bezeichnung.value = newPageHint;

    const attachmentDescription = getGeldanlagenBezeichnung(
      context.geldanlagen,
    ).join("\n");
    attachment.unshift({
      title: "Geldanlagen",
      text: attachmentDescription,
    });
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
    const befristungTypeLookup = {
      lifeInsurance: "Lebensversicherung",
      buildingSavingsContract: "Bausparvertrag",
      fixedDepositAccount: "Festgeldkonto",
    };
    const befristungType =
      anlage.befristetArt && anlage.befristetArt in befristungTypeLookup
        ? `Art der Befristung: ${befristungTypeLookup[anlage.befristetArt]}`
        : "";
    bezeichnung.push(befristungType);
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
