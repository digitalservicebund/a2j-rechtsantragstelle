import type {
  BankkontenArraySchema,
  Eigentumer,
  GeldanlagenArraySchema,
  GrundeigentumArraySchema,
  KraftfahrzeugeArraySchema,
  WertsachenArraySchema,
} from "~/domains/shared/finanzielleAngaben/context";
import type { AttachmentEntries } from "~/services/pdf/attachment";

export const befristungMapping = {
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

export const geldanlageArtMapping: Record<string, string> = {
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
  bankkonten: BankkontenArraySchema,
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

export const attachKraftfahrzeugeToAnhang = (
  kraftfahrzeuge: KraftfahrzeugeArraySchema,
) => {
  const attachment: AttachmentEntries = [];
  attachment.push({
    title: "Kraftfahrzeuge",
    level: "h3",
  });
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
        text: kraftfahrzeug.verkaufswert
          ? kraftfahrzeug.verkaufswert + " €"
          : kfzWert,
      },
      {
        title: "Wird für Arbeitsweg benutzt",
        text: kraftfahrzeug.hasArbeitsweg === "yes" ? "Ja" : "Nein",
      },
    );

    if (kraftfahrzeug.eigentuemer)
      attachment.push({
        title: "Eigentümer:in",
        text: eigentuemerMapping[kraftfahrzeug.eigentuemer],
      });
    if (kraftfahrzeug.art)
      attachment.push({ title: "Art", text: kraftfahrzeug.art });
    if (kraftfahrzeug.marke)
      attachment.push({ title: "Marke", text: kraftfahrzeug.marke });
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
    if (kraftfahrzeug.kilometerstand)
      attachment.push({
        title: "Kilometerstand",
        text: String(kraftfahrzeug.kilometerstand) + " km",
      });
  });
  return { attachment };
};

export const attachGeldanlagenToAnhang = (
  geldanlagen: GeldanlagenArraySchema,
) => {
  const attachment: AttachmentEntries = [];
  attachment.push({
    title: "Sonstige Vermögenswerte",
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
    if (geldanlage.auszahlungdatum)
      attachment.push({
        title: "Auszahlungsdatum",
        text: geldanlage.auszahlungdatum,
      });
    if (geldanlage.befristetArt)
      attachment.push({
        title: "Art der Befristung",
        text: befristungMapping[geldanlage.befristetArt],
      });
    if (geldanlage.forderung)
      attachment.push({ title: "Forderung", text: geldanlage.forderung });
    if (geldanlage.verwendungszweck)
      attachment.push({
        title: "Verwendungszweck",
        text: geldanlage.verwendungszweck,
      });
    if (geldanlage.kontoBankName)
      attachment.push({
        title: "Name der Bank",
        text: geldanlage.kontoBankName,
      });
    if (geldanlage.kontoBezeichnung)
      attachment.push({
        title: "Bezeichnung",
        text: geldanlage.kontoBezeichnung,
      });
    if (geldanlage.kontoIban)
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
  if (kraftfahrzeug.art) description += `, Art: ${kraftfahrzeug.art}`;
  if (kraftfahrzeug.marke) description += `, Marke: ${kraftfahrzeug.marke}`;
  if (kraftfahrzeug.baujahr)
    description += `, Baujahr: ${kraftfahrzeug.baujahr}`;
  if (kraftfahrzeug.anschaffungsjahr)
    description += `, Anschaffungsjahr: ${kraftfahrzeug.anschaffungsjahr}`;
  if (kraftfahrzeug.kilometerstand)
    description += `, Kilometerstand: ${kraftfahrzeug.kilometerstand}`;
  return description;
}

export function fillSingleGeldanlage(geldanlage: GeldanlagenArraySchema[0]) {
  let description =
    geldanlage.art && geldanlage.art in geldanlageArtMapping
      ? `Art: ${geldanlageArtMapping[geldanlage.art]}`
      : (geldanlage.art ?? "");
  if (geldanlage.eigentuemer === "myselfAndSomeoneElse")
    description += `, Eigentümer:in: ${eigentuemerMapping[geldanlage.eigentuemer]}`;

  if (geldanlage.auszahlungdatum)
    description += `, Auszahlungsdatum: ${geldanlage.auszahlungdatum}`;
  if (geldanlage.befristetArt)
    description += `, Art der Befristung: ${befristungMapping[geldanlage.befristetArt]}`;
  if (geldanlage.verwendungszweck)
    description += `, Verwendungszweck: ${geldanlage.verwendungszweck}`;
  if (geldanlage.forderung)
    description += `, Forderung: ${geldanlage.forderung}`;
  if (geldanlage.kontoBezeichnung)
    description += `, Bezeichnung: ${geldanlage.kontoBezeichnung}`;
  if (geldanlage.kontoBankName)
    description += `, Name der Bank: ${geldanlage.kontoBankName}`;
  if (geldanlage.kontoIban) description += `, IBAN: ${geldanlage.kontoIban}`;
  return description;
}

export function fillSingleWertsache(wertsache: WertsachenArraySchema[0]) {
  let description = `Art: ${wertsache.art}`;
  if (wertsache.eigentuemer === "myselfAndSomeoneElse")
    description += `, Eigentümer:in: ${eigentuemerMapping[wertsache.eigentuemer]}`;
  return description;
}
