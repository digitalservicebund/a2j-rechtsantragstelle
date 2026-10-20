import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { getRechtsproblemStrings } from "~/domains/beratungshilfe/formular/rechtsproblem/stringReplacements";
import {
  geldAnlagenStrings,
  getArrayIndexStrings,
  getKinderStrings,
} from "../../shared/formular/stringReplacements";
import type { BeratungshilfeFormularUserData } from "./userData";

const getAmtsgerichtStrings = (context: BeratungshilfeFormularUserData) => {
  const court = findCourt({
    zipCode: context.plz,
    streetName: context.street,
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

const getStaatlicheLeistungenStrings = (
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

const weiteresEinkommenStrings = (context: BeratungshilfeFormularUserData) => {
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

const ausgabenStrings = (context: BeratungshilfeFormularUserData) => {
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

const getAnwaltStrings = (context: BeratungshilfeFormularUserData) => {
  return { hasNoAnwalt: context.anwaltskanzlei !== "yes" };
};

// lives here (not in formular/index.ts) so services/pdf can use it without a circular import
export const getBeratungshilfeStringReplacements = (
  context: BeratungshilfeFormularUserData,
) => ({
  ...getAmtsgerichtStrings(context),
  ...getStaatlicheLeistungenStrings(context),
  ...getKinderStrings(context),
  ...getArrayIndexStrings(context),
  ...getAnwaltStrings(context),
  ...getRechtsproblemStrings(context),
  ...ausgabenStrings(context),
  ...geldAnlagenStrings(context),
  ...weiteresEinkommenStrings(context),
});
