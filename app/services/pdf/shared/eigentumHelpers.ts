import type {
  Eigentumer,
  GrundeigentumArraySchema,
} from "~/flows/shared/finanzielleAngaben/context";

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
