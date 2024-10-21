import type {
  BankkontenArraySchema,
  Eigentumer,
  GrundeigentumArraySchema,
} from "~/flows/shared/finanzielleAngaben/context";
import type { AttachmentEntries } from "~/services/pdf/attachment";

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
  attachment: AttachmentEntries,
  grundeigentum: GrundeigentumArraySchema,
) => {
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
