import { nebenantragArtLabels } from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/components/nebenantragContent";
import { type Nebenantraege } from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
import { type BeweisMittel } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { translations } from "~/services/translations/translations";

export const getAbsaetzeBaseUrl = (
  hauptantragIndex: number,
  nebenantragIndex?: number,
) => {
  const nebenantragSlug =
    nebenantragIndex !== undefined ? `/nebenantrag/${nebenantragIndex}` : "";
  return `/geld-einklagen/anwaltschaft/tatsachenvortrag-beweise/hauptantrag/${hauptantragIndex}${nebenantragSlug}/absaetze`;
};

export const getNebenantragTitle = (
  nebenantrag: Nebenantraege,
  index: number,
  parentIndex: number,
) => {
  const displayIndex = `${parentIndex + 1}${String.fromCodePoint(("a".codePointAt(0) ?? 0) + index)}`;
  const title =
    nebenantrag.type === "nebenantrag"
      ? translations.geldEinklagenAnwaltschaft.nebenantrag.de
      : translations.geldEinklagenAnwaltschaft.feststellungsantrag.de;
  const parentheticalInfo = `${nebenantrag.type === "nebenantrag" ? nebenantragArtLabels[nebenantrag.nebenantragArt] : translations.geldEinklagenAnwaltschaft.annahmeverzug.de}`;
  return `${title} ${displayIndex} (${parentheticalInfo})`;
};

export type BeweisType = "document" | "person";

export const getBeweisType = (mittel: BeweisMittel): BeweisType => {
  switch (mittel) {
    case "urkunde":
    case "augenschein":
    case "sachverstaendigengutachten":
      return "document";
    case "zeuge":
    case "parteivernehmung":
      return "person";
  }
};
