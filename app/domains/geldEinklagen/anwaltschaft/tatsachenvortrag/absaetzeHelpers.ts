import { nebenantragArtLabels } from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/components/nebenantragContent";
import { type Nebenantrag } from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
import {
  type BeweiseArray,
  type BeweisType,
} from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { translations } from "~/services/translations/translations";

export const getAbsaetzeBaseUrl = (
  hauptantragIndex: number,
  nebenantragIndex?: number,
) => {
  const nebenantragSlug =
    nebenantragIndex !== undefined ? `/nebenantraege/${nebenantragIndex}` : "";
  return `/geld-einklagen/anwaltschaft/tatsachenvortrag-beweise/hauptantrag/${hauptantragIndex}${nebenantragSlug}/absaetze`;
};

export const getNebenantragTitle = (
  nebenantrag: Nebenantrag,
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

export const getBeweisTitle = (type: BeweisType, index: number) => {
  switch (type) {
    case "zeuge":
      return `${translations.geldEinklagenAnwaltschaft.beweis.de} ${translations.geldEinklagenAnwaltschaft.zeugnis.de}`;
    case "parteivernehmung":
      return `${translations.geldEinklagenAnwaltschaft.beweis.de} ${translations.beweismittel.parteivernehmung.de}`;
    default:
      return `${translations.geldEinklagenAnwaltschaft.beweis.de} K${index + 1}`;
  }
};

export const getBeweisBody = (beweis: NonNullable<BeweiseArray>[number]) => {
  switch (beweis.type) {
    case "zeuge":
      return "";
    case "parteivernehmung":
      return "";
    default:
      return beweis.beschreibung;
  }
};

export const getBeweisArrayName = (isHauptantrag: boolean) =>
  `hauptantrag#${isHauptantrag ? "" : "nebenantraege#"}absaetze#beweise`;

export type BeweisCategory = "document" | "person";

export const getBeweisCategory = (type: BeweisType): BeweisCategory => {
  switch (type) {
    case "urkunde":
    case "augenschein":
    case "sachverstaendigengutachten":
      return "document";
    case "zeuge":
    case "parteivernehmung":
      return "person";
  }
};
