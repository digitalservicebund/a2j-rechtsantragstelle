import { beratungshilfePersoenlicheDatenDone } from "~/domains/beratungshilfe/formular/persoenlicheDaten/doneFunctions";
import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { anwaltlicheVertretungDone } from "./anwaltlicheVertretung/guards";
import {
  andereUnterhaltszahlungenDone,
  ausgabenDone,
  einkommenDone,
  kinderDone,
  partnerDone,
  wohnungDone,
  eigentumDone,
} from "./finanzielleAngaben/doneFunctions";
import { eigentumZusammenfassungDone } from "./finanzielleAngaben/eigentumZusammenfassungDone";
import { eigentumTotalWorthLessThan10000 } from "./finanzielleAngaben/guards";
import type { BeratungshilfeFormularUserData } from "./index";
import { rechtsproblemDone } from "./rechtsproblem/rechtsproblemDone";

export const getAmtsgerichtStrings = (
  context: BeratungshilfeFormularUserData,
) => {
  const court = findCourt({
    zipCode: context.plz,
    streetSlug: context.street,
    houseNumber: context.houseNumber,
  });
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
  context: BeratungshilfeFormularUserData,
) => {
  return {
    hasBuergergeld: context.staatlicheLeistungen === "buergergeld",
    hasGrundsicherung: context.staatlicheLeistungen === "grundsicherung",
    hasAsylbewerberleistungen:
      context.staatlicheLeistungen === "asylbewerberleistungen",
    hasNoSozialleistung: context.staatlicheLeistungen === "keine",
    hasBuergergeldOrNoSozialleistung:
      context.staatlicheLeistungen === "buergergeld" ||
      context.staatlicheLeistungen === "keine",
  };
};

export const weiteresEinkommenStrings = (
  context: BeratungshilfeFormularUserData,
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

export const ausgabenStrings = (context: BeratungshilfeFormularUserData) => {
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

export const getAnwaltStrings = (context: BeratungshilfeFormularUserData) => {
  return { hasNoAnwalt: context.anwaltskanzlei !== "yes" };
};

export const eigentumZusammenfassungShowTotalWorthWarnings = (
  context: BeratungshilfeFormularUserData,
) => {
  return {
    eigentumTotalWorthLessThan10000: eigentumTotalWorthLessThan10000({
      context,
    }),
  };
};

export const getMissingInformationStrings = (
  context: BeratungshilfeFormularUserData,
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

export const getWeitereDokumenteStrings = (
  context: BeratungshilfeFormularUserData,
) => {
  return {
    hasWeitereDokumente: context.weitereDokumenteBeweis !== null,
  };
};
