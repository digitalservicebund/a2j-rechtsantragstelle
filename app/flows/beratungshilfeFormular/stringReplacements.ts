import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { logError } from "~/services/logging";
import type { BeratungshilfeFormularContext } from ".";
import { anwaltlicheVertretungDone } from "./anwaltlicheVertretung/guards";
import { eigentumZusammenfassungDone } from "./finanzielleAngaben/eigentumZusammenfassungDone";
import {
  eigentumDone,
  finanzielleAngabeGuards,
} from "./finanzielleAngaben/guards";
import {
  andereUnterhaltszahlungenDone,
  ausgabenDone,
  einkommenDone,
  kinderDone,
  partnerDone,
  wohnungDone,
} from "./finanzielleAngaben/navStates";
import { beratungshilfePersoenlicheDatenDone } from "./persoenlicheDaten/context";
import { rechtsproblemDone } from "./rechtsproblem/context";

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
      logError({
        message: `Did not find court for plz: ${context.plz}`,
        error: e,
      });
    }
  }
  return {};
};

export const getStaatlicheLeistungenStrings = (
  context: BeratungshilfeFormularContext,
) => {
  return {
    hasBuergergeld: context.staatlicheLeistungen === "buergergeld",
    hasGrundsicherung: context.staatlicheLeistungen === "grundsicherung",
    hasAsylbewerberleistungen:
      context.staatlicheLeistungen === "asylbewerberleistungen",
    hasNoSozialleistung: context.staatlicheLeistungen === "keine",
  };
};

export const getAnwaltStrings = (context: BeratungshilfeFormularContext) => {
  return { hasNoAnwalt: context.anwaltskanzlei !== "yes" };
};

export const eigentumZusammenfassungShowWarnings = (
  context: BeratungshilfeFormularContext,
) => {
  return {
    hasPartnerschaftYes: finanzielleAngabeGuards.hasPartnerschaftYes({
      context,
    }),
    eigentumTotalWorthLessThan10000:
      finanzielleAngabeGuards.eigentumTotalWorthLessThan10000({
        context,
      }),
  };
};

export const getMissingInformationStrings = (
  context: BeratungshilfeFormularContext,
) => {
  const alwaysChecked = {
    anwaltlicheVertretungMissingInformation: !anwaltlicheVertretungDone({
      context,
    }),
    rechtsproblemMissingInformation: !rechtsproblemDone({ context }),
    einkommenMissingInformation: !einkommenDone({ context }),
    persoenlicheDatenMissingInformation: !beratungshilfePersoenlicheDatenDone({
      context,
    }),
  };

  const requiresEinkommenDone =
    einkommenDone({ context }) || context.staatlicheLeistungen == "keine"
      ? {
          partnerMissingInformation: !partnerDone({ context }),
          kinderMissingInformation: !kinderDone({ context }),
          andereUnterhaltszahlungenMissingInformation:
            !andereUnterhaltszahlungenDone({ context }),
          wohnungMissingInformation: !wohnungDone({ context }),
          eigentumMissingInformation: !eigentumDone({ context }),
          eigentumZusammenfassungMissingInformation:
            !eigentumZusammenfassungDone({ context }) &&
            eigentumDone({ context }),
          ausgabenMissingInformation: !ausgabenDone({ context }),
        }
      : {};

  return {
    ...alwaysChecked,
    ...requiresEinkommenDone,
  };
};
