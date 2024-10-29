import type { BeratungshilfeFormularContext } from "../beratungshilfe/beratungshilfeFormular";
import type { ProzesskostenhilfeFormularContext } from "../prozesskostenhilfeFormular";
import { hasPartnerschaftYes } from "./finanzielleAngaben/guards";

export const getKinderStrings = (
  context: BeratungshilfeFormularContext | ProzesskostenhilfeFormularContext,
) => {
  const arrayIndex = context.pageData?.arrayIndexes.at(0);
  if (
    typeof arrayIndex === "undefined" ||
    !context.kinder ||
    arrayIndex > context.kinder.length + 1
  )
    return {};
  if (arrayIndex < context.kinder.length)
    return {
      "kind#vorname": context.kinder?.[arrayIndex].vorname,
      "kind#nachname": context.kinder?.[arrayIndex].nachname,
    };
};

export const getArrayIndexStrings = (
  context: BeratungshilfeFormularContext | ProzesskostenhilfeFormularContext,
) => {
  const arrayIndex = context.pageData?.arrayIndexes.at(0);
  return typeof arrayIndex !== "undefined"
    ? { "array#index": String(arrayIndex + 1) }
    : {};
};

export const geldAnlagenStrings = (
  context: BeratungshilfeFormularContext | ProzesskostenhilfeFormularContext,
) => {
  return {
    hasLebensversicherung:
      context.hasGeldanlage === "yes" &&
      context.geldanlagen?.some(
        (geldanlage) => geldanlage.befristetArt === "lifeInsurance",
      ),
    hasBausparvertrag:
      context.hasGeldanlage === "yes" &&
      context.geldanlagen?.some(
        (geldanlage) => geldanlage.befristetArt === "buildingSavingsContract",
      ),
    hasWertpapiere:
      context.hasGeldanlage === "yes" &&
      context.geldanlagen?.some(
        (geldanlage) => geldanlage.art === "wertpapiere",
      ),
    hasGutenhabenKrypto:
      context.hasGeldanlage === "yes" &&
      context.geldanlagen?.some(
        (geldanlage) => geldanlage.art === "guthabenkontoKrypto",
      ),
    hasGiroTagesSparkonto:
      context.hasGeldanlage === "yes" &&
      context.geldanlagen?.some(
        (geldanlage) => geldanlage.art === "giroTagesgeldSparkonto",
      ),
    hasGrundeigentum: context.hasGrundeigentum === "yes",
  };
};

export const eigentumZusammenfassungShowPartnerschaftWarnings = (
  context: BeratungshilfeFormularContext | ProzesskostenhilfeFormularContext,
) => {
  return {
    hasPartnerschaftYes: hasPartnerschaftYes({
      context,
    }),
  };
};
