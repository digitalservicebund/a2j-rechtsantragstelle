import { beratungshilfePersoenlicheDatenDone } from "~/domains/beratungshilfe/formular/persoenlicheDaten/doneFunctions";
import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { anwaltlicheVertretungDone } from "./anwaltlicheVertretung/guards";
import { einkommenDone } from "./finanzielleAngaben/einkommen/doneFunctions";
import { rechtsproblemDone } from "./rechtsproblem/rechtsproblemDone";
import type { BeratungshilfeFormularUserData } from "./userData";
import { andereUnterhaltszahlungenDone } from "./finanzielleAngaben/andereUnterhaltszahlungen/doneFunctions";
import { kinderDone } from "./finanzielleAngaben/kinder/doneFunctions";
import { eigentumDone } from "./finanzielleAngaben/eigentum/doneFunctions";
import { partnerDone } from "./finanzielleAngaben/partner/doneFunctions";
import { ausgabenDone } from "./finanzielleAngaben/regelmaessigeAusgaben/doneFunctions";
import { wohnungDone } from "./finanzielleAngaben/wohnung/doneFunctions";

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

  let requiresEinkommenDone = {};

  if (context.staatlicheLeistungen === "keine") {
    requiresEinkommenDone = {
      partnerMissingInformation: !partnerDone({ context }),
      kinderMissingInformation: !kinderDone({ context }),
      andereUnterhaltszahlungenMissingInformation:
        !andereUnterhaltszahlungenDone({ context }),
      wohnungMissingInformation: !wohnungDone({ context }),
      eigentumMissingInformation: !eigentumDone({ context }),
      ausgabenMissingInformation: !ausgabenDone({ context }),
    };
  } else if (context.staatlicheLeistungen === "buergergeld") {
    requiresEinkommenDone = {
      eigentumMissingInformation: !eigentumDone({ context }),
    };
  }
  // For "grundsicherung" and "asylbewerberleistungen", requiresEinkommenDone remains {}

  return {
    ...alwaysChecked,
    ...requiresEinkommenDone,
  };
};

export const getWeitereDokumenteStrings = (
  context: BeratungshilfeFormularUserData,
) => {
  return {
    hasWeitereDokumente: context.weitereDokumenteBeweis !== undefined,
  };
};
