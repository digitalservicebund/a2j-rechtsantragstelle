import type z from "zod";
import type {
  kraftfahrzeugeArraySchema as berhKraftfahrzeugeArraySchema,
  wertsacheSchema as berhWertsacheSchema,
  grundeigentumArraySchema as berhGrundeigentumArraySchema,
  geldanlagenArraySchema as berhGeldanlagenArraySchema,
  bankkontenArraySchema as berhBankkontenArraySchema,
} from "~/domains/beratungshilfe/formular/finanzielleAngaben/eigentum/pages";
import type {
  wertsacheSchema as pkhWertsacheSchema,
  kraftfahrzeugeArraySchema as pkhKraftfahrzeugeArraySchema,
  grundeigentumArraySchema as pkhGrundeigentumArraySchema,
  geldanlagenArraySchema as pkhGeldanlagenArraySchema,
  bankkontenArraySchema as pkhBankkontenArraySchema,
} from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/eigentum/pages";
import type { Eigentumer } from "~/domains/shared/formular/finanzielleAngaben/userData";
import type { AttachmentEntries } from "~/services/pdf/attachment";

const befristungMapping = {
  lifeInsurance: "Lebensversicherung",
  buildingSavingsContract: "Bausparvertrag",
  fixedDepositAccount: "Festgeldkonto",
};

export const eigentuemerMapping: Record<Eigentumer, string> = {
  myself: "Ich alleine",
  partner: "Ehe-Partner:in",
  myselfAndPartner: "Mein:e Ehe-Partner:in und ich gemeinsam",
  myselfAndSomeoneElse: "Ich gemeinsam mit jemand anderem",
};

type GrundeigentumArraySchema =
  | z.infer<typeof pkhGrundeigentumArraySchema>
  | z.infer<typeof berhGrundeigentumArraySchema>;

type GeldanlagenArraySchema = z.infer<
  typeof berhGeldanlagenArraySchema | typeof pkhGeldanlagenArraySchema
>;

export type BankkontenArray = z.infer<
  typeof berhBankkontenArraySchema | typeof pkhBankkontenArraySchema
>;

export const grundeigentumArtMapping: Record<
  NonNullable<GrundeigentumArraySchema[0]["art"]>,
  string
> = {
  eigentumswohnung: "Wohnung",
  einfamilienhaus: "Haus für Familie",
  mehrereWohnungen: "Haus mit mehreren Wohnungen",
  unbebaut: "Grundstück",
  erbbaurecht: "Erbbaurecht",
  garage: "Garagen(-hof)",
};

const geldanlageArtMapping: Record<string, string> = {
  bargeld: "Bargeld",
  wertpapiere: "Wertpapiere",
  guthabenkontoKrypto: "Guthabenkonto oder Kryptowährung",
  giroTagesgeldSparkonto: "Girokonto / Tagesgeld / Sparkonto",
  befristet: "Befristete Geldanlage",
  forderung: "Forderung",
  sonstiges: "Sonstiges",
};

export const verkaufswertMappingDescription = {
  under10000: "unter 10.000€",
  over10000: "Mehr als 10.000€",
  unsure: "Unsicher",
};

export const attachBankkontenToAnhang = (
  attachment: AttachmentEntries,
  bankkonten: BankkontenArray,
) => {
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
  return { attachment };
};

export const attachGrundeigentumToAnhang = (
  grundeigentum: GrundeigentumArraySchema,
) => {
  const attachment: AttachmentEntries = [];
  attachment.push({
    title: "Grundeigentum",
    level: "h3",
  });

  grundeigentum.forEach((grundeigentum, index) => {
    attachment.push(
      { title: `Grundeigentum ${index + 1}`, level: "h4" },
      {
        title: "Art",
        text: grundeigentum.art
          ? grundeigentumArtMapping[grundeigentum.art]
          : "",
      },
      {
        title: "Eigentümer:in",
        text: grundeigentum.eigentuemer
          ? eigentuemerMapping[grundeigentum.eigentuemer]
          : "",
      },
      { title: "Fläche", text: grundeigentum.flaeche + " m²" },
      { title: "Verkehrswert", text: grundeigentum.verkaufswert + " €" },
    );
    if (grundeigentum.isBewohnt === "yes")
      attachment.push({ title: "Eigennutzung", text: "Ja" });
    else if (grundeigentum.isBewohnt === "family")
      attachment.push({ title: "Eigennutzung", text: "Von Familie" });
    if (grundeigentum.isBewohnt !== "yes")
      attachment.push({
        title: "Addresse",
        text: `${grundeigentum.strassehausnummer}, ${grundeigentum.plz} ${grundeigentum.ort} ${grundeigentum.land}`,
      });
  });
  return { attachment };
};

type KraftfahrzeugeArraySchema =
  | z.infer<typeof berhKraftfahrzeugeArraySchema>
  | z.infer<typeof pkhKraftfahrzeugeArraySchema>;

export const attachKraftfahrzeugeToAnhang = (
  kraftfahrzeuge: KraftfahrzeugeArraySchema,
) => {
  const attachment: AttachmentEntries = [];
  attachment.push({ title: "Kraftfahrzeuge", level: "h3" });

  kraftfahrzeuge.forEach((kraftfahrzeug, index) => {
    const kfzWert = kraftfahrzeug.wert
      ? verkaufswertMappingDescription[kraftfahrzeug.wert]
      : "";
    attachment.push(
      {
        title: `Kraftfahrzeug ${index + 1}`,
        level: "h4",
      },
      {
        title: "Verkaufswert",
        text:
          "verkaufswert" in kraftfahrzeug
            ? kraftfahrzeug.verkaufswert + " €"
            : kfzWert,
      },
      {
        title: "Wird für Arbeitsweg benutzt",
        text: kraftfahrzeug.hasArbeitsweg === "yes" ? "Ja" : "Nein",
      },
    );

    if (kraftfahrzeug.wert !== "under10000") {
      attachment.push(
        {
          title: "Eigentümer:in",
          text: eigentuemerMapping[kraftfahrzeug.eigentuemer],
        },
        { title: "Art", text: kraftfahrzeug.art },
        { title: "Marke", text: kraftfahrzeug.marke },
        {
          title: "Kilometerstand",
          text: String(kraftfahrzeug.kilometerstand) + " km",
        },
      );

      if (kraftfahrzeug.anschaffungsjahr)
        attachment.push({
          title: "Anschaffungsjahr",
          text: String(kraftfahrzeug.anschaffungsjahr),
        });
      if (kraftfahrzeug.baujahr)
        attachment.push({
          title: "Baujahr",
          text: String(kraftfahrzeug.baujahr),
        });
    }
  });
  return { attachment };
};

export const attachGeldanlagenToAnhang = (
  geldanlagen: GeldanlagenArraySchema,
  attachmentSectionHeading = "Sonstige Vermögenswerte",
) => {
  const attachment: AttachmentEntries = [];
  attachment.push({
    title: attachmentSectionHeading,
    level: "h3",
  });
  geldanlagen.forEach((geldanlage, index) => {
    const geldanlageArt = geldanlage.art
      ? geldanlageArtMapping[geldanlage.art]
      : "";
    const geldanlageEigentumer = geldanlage.eigentuemer
      ? eigentuemerMapping[geldanlage.eigentuemer]
      : "";
    attachment.push(
      { title: `Geldanlage ${index + 1}`, level: "h4" },
      { title: "Art", text: geldanlageArt },
      { title: "Wert", text: geldanlage.wert },
      {
        title: "Eigentümer:in",
        text: geldanlageEigentumer,
      },
    );
    if ("auszahlungdatum" in geldanlage)
      attachment.push(
        {
          title: "Auszahlungsdatum",
          text: geldanlage.auszahlungdatum,
        },
        {
          title: "Art der Befristung",
          text: befristungMapping[geldanlage.befristetArt],
        },
      );

    if ("forderung" in geldanlage)
      attachment.push({ title: "Forderung", text: geldanlage.forderung });
    if ("verwendungszweck" in geldanlage)
      attachment.push({
        title: "Verwendungszweck",
        text: geldanlage.verwendungszweck,
      });
    if ("kontoBankName" in geldanlage)
      attachment.push({
        title: "Name der Bank",
        text: geldanlage.kontoBankName,
      });
    if ("kontoBezeichnung" in geldanlage)
      attachment.push({
        title: "Bezeichnung",
        text: geldanlage.kontoBezeichnung,
      });
    if ("kontoIban" in geldanlage)
      attachment.push({
        title: "IBAN",
        text: geldanlage.kontoIban,
      });
  });
  return { attachment };
};

export function fillSingleKraftfahrzeug(
  kraftfahrzeug: KraftfahrzeugeArraySchema[0],
) {
  let description = `Wird ${kraftfahrzeug.hasArbeitsweg === "no" ? "nicht " : ""}für Arbeitsweg gebraucht`;
  if (kraftfahrzeug.wert !== "under10000") {
    description += `, Art: ${kraftfahrzeug.art}`;
    description += `, Marke: ${kraftfahrzeug.marke}`;
    description += `, Kilometerstand: ${kraftfahrzeug.kilometerstand}`;
    if (kraftfahrzeug.baujahr)
      description += `, Baujahr: ${kraftfahrzeug.baujahr}`;
    if (kraftfahrzeug.anschaffungsjahr)
      description += `, Anschaffungsjahr: ${kraftfahrzeug.anschaffungsjahr}`;
  }
  return description;
}

export function fillSingleGeldanlage(geldanlage: GeldanlagenArraySchema[0]) {
  let description =
    geldanlage.art && geldanlage.art in geldanlageArtMapping
      ? `Art: ${geldanlageArtMapping[geldanlage.art]}`
      : (geldanlage.art ?? "");
  if (geldanlage.eigentuemer === "myselfAndSomeoneElse")
    description += `, Eigentümer:in: ${eigentuemerMapping[geldanlage.eigentuemer]}`;

  if ("auszahlungdatum" in geldanlage)
    description += `, Auszahlungsdatum: ${geldanlage.auszahlungdatum}`;
  if ("befristetArt" in geldanlage)
    description += `, Art der Befristung: ${befristungMapping[geldanlage.befristetArt]}`;
  if ("verwendungszweck" in geldanlage)
    description += `, Verwendungszweck: ${geldanlage.verwendungszweck}`;
  if ("forderung" in geldanlage)
    description += `, Forderung: ${geldanlage.forderung}`;
  if ("kontoBezeichnung" in geldanlage)
    description += `, Bezeichnung: ${geldanlage.kontoBezeichnung}`;
  if ("kontoBankName" in geldanlage)
    description += `, Name der Bank: ${geldanlage.kontoBankName}`;
  if ("kontoIban" in geldanlage)
    description += `, IBAN: ${geldanlage.kontoIban}`;
  return description;
}

export function fillSingleWertsache(
  wertsache: z.infer<typeof pkhWertsacheSchema | typeof berhWertsacheSchema>,
) {
  let description = `Art: ${wertsache.art}`;
  if (wertsache.eigentuemer === "myselfAndSomeoneElse")
    description += `, Eigentümer:in: ${eigentuemerMapping[wertsache.eigentuemer]}`;
  return description;
}
