import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import type { BeratungshilfeFormularContext } from ".";
import { finanzielleAngabeGuards } from "./finanzielleAngaben/guards";

export const getKinderStrings = (context: BeratungshilfeFormularContext) => {
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
  context: BeratungshilfeFormularContext,
) => {
  const arrayIndex = context.pageData?.arrayIndexes.at(0);
  return typeof arrayIndex !== "undefined"
    ? { "array#index": String(arrayIndex + 1) }
    : {};
};

export const getAmtsgerichtStrings = (
  context: BeratungshilfeFormularContext,
) => {
  if ("plz" in context && context.plz) {
    try {
      const courtData = findCourt({ zipCode: context.plz });
      return {
        courtName: courtData?.BEZEICHNUNG,
        courtStreetNumber: courtData?.STR_HNR,
        courtPlz: courtData?.PLZ_ZUSTELLBEZIRK,
        courtOrt: courtData?.ORT,
        courtWebsite: courtData?.URL1,
        courtTelephone: courtData?.TEL,
      };
    } catch (e) {
      console.error(`Did not find court for plz: ${context.plz}`, e);
    }
  }
  return {};
};

export const getStaatlicheLeistungenStrings = (
  context: BeratungshilfeFormularContext,
) => {
  const getTrueOrUndefined = (keyWord: string) => {
    return (
      ("staatlicheLeistungen" in context &&
        context.staatlicheLeistungen == keyWord &&
        "true") ||
      undefined
    );
  };
  return {
    hasBuergergeld: getTrueOrUndefined("buergergeld"),
    hasGrundsicherung: getTrueOrUndefined("grundsicherung"),
    hasAsylbewerberleistungen: getTrueOrUndefined("asylbewerberleistungen"),
    hasAndereLeistung: getTrueOrUndefined("andereLeistung"),
    hasNoSozialleistung: getTrueOrUndefined("keine"),
  };
};

export const getAnwaltStrings = (context: BeratungshilfeFormularContext) => {
  return {
    hasNoAnwalt:
      !("anwaltskanzlei" in context) || context.anwaltskanzlei == "no"
        ? "true"
        : undefined,
  };
};

export const eigentumZusammenfassungShowWarnings = (
  context: BeratungshilfeFormularContext,
) => {
  // TODO: remove hasPartnerschaftOrSeparated once '/beratungshilfe/antrag/finanzielleAngaben/eigentum-zusammenfassung/zusammenfassung' has been changed to use 'hasPartnerschaftYes'
  return {
    hasPartnerschaftOrSeparated:
      finanzielleAngabeGuards.hasPartnerschaftOrSeparated({
        context,
      }),
    hasPartnerschaftYes: finanzielleAngabeGuards.hasPartnerschaftYes({
      context,
    }),
    eigentumTotalWorthLessThan10000:
      finanzielleAngabeGuards.eigentumTotalWorthLessThan10000({
        context,
      }),
  };
};
