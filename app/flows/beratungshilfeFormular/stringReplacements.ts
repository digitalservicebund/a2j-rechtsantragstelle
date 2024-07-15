import { findCourtIfUnique } from "~/services/gerichtsfinder/amtsgerichtData.server";
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
  const court = findCourtIfUnique(context.plz);
  return {
    courtName: court?.BEZEICHNUNG,
    courtStreetNumber: court?.STR_HNR,
    courtPlz: court?.PLZ_ZUSTELLBEZIRK,
    courtOrt: court?.ORT,
    courtWebsite: court?.URL1,
    courtTelephone: court?.TEL,
  };
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

export const weiteresEinkommenStrings = (
  context: BeratungshilfeFormularContext,
) => {
  const { weitereseinkommen } = context;
  return {
    arbeitslosenGeld: weitereseinkommen?.arbeitlosengeld === "on",
    wohngeld: weitereseinkommen?.wohngeld === "on",
    bafoeg: weitereseinkommen?.bafoeg === "on",
    rente: weitereseinkommen?.rente === "on",
    krankengeld: weitereseinkommen?.krankengeld === "on",
    elterngeld: weitereseinkommen?.elterngeld === "on",
  };
};

export const geldAnlagenStrings = (context: BeratungshilfeFormularContext) => {
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
    hasGiroTagesSparkonteo:
      context.hasGeldanlage === "yes" &&
      context.geldanlagen?.some(
        (geldanlage) => geldanlage.art === "giroTagesgeldSparkonto",
      ),
    hasGrundeigentum: context.hasGrundeigentum === "yes",
  };
};

export const ausgabenStrings = (context: BeratungshilfeFormularContext) => {
  return {
    hasSchwangerschaft:
      context.hasAusgaben === "yes" &&
      context.ausgabensituation?.pregnancy === "on",
    hasSchwerbehinderung:
      context.hasAusgaben === "yes" &&
      context.ausgabensituation?.disability === "on",
    hasMedicalReasons:
      context.hasAusgaben === "yes" &&
      context.ausgabensituation?.medicalReasons === "on",
    hasWeitereAusgaben:
      context.hasAusgaben === "yes" &&
      context.ausgaben &&
      context.ausgaben.length > 0,
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
