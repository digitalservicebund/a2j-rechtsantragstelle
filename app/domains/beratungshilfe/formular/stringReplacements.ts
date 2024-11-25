import { CheckboxValue } from "~/components/inputs/Checkbox";
import { beratungshilfePersoenlicheDatenDone } from "~/domains/beratungshilfe/formular/persoenlicheDaten/doneFunctions";
import { findCourtIfUnique } from "~/services/gerichtsfinder/amtsgerichtData.server";
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
import type { BeratungshilfeFormularContext } from "./index";
import { rechtsproblemDone } from "./rechtsproblem/context";

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
    staatlicheLeistungenIsGrundsicherung:
      context.staatlicheLeistungen === "grundsicherung",
    staatlicheLeistungenIsAsylbewerberleistungen:
      context.staatlicheLeistungen === "asylbewerberleistungen",
    hasNoSozialleistung: context.staatlicheLeistungen === "keine",
    hasBuergergeldOrNoSozialleistung:
      context.staatlicheLeistungen === "buergergeld" ||
      context.staatlicheLeistungen === "keine",
  };
};

export const weiteresEinkommenStrings = (
  context: BeratungshilfeFormularContext,
) => {
  const { weitereseinkommen } = context;
  return {
    arbeitslosenGeld: weitereseinkommen?.arbeitlosengeld === CheckboxValue.on,
    wohngeld: weitereseinkommen?.wohngeld === CheckboxValue.on,
    bafoeg: weitereseinkommen?.bafoeg === CheckboxValue.on,
    rente: weitereseinkommen?.rente === CheckboxValue.on,
    krankengeld: weitereseinkommen?.krankengeld === CheckboxValue.on,
    elterngeld: weitereseinkommen?.elterngeld === CheckboxValue.on,
  };
};

export const ausgabenStrings = (context: BeratungshilfeFormularContext) => {
  return {
    hasSchwangerschaft:
      context.hasAusgaben === "yes" &&
      context.ausgabensituation?.pregnancy === CheckboxValue.on,
    hasSchwerbehinderung:
      context.hasAusgaben === "yes" &&
      context.ausgabensituation?.disability === CheckboxValue.on,
    hasMedicalReasons:
      context.hasAusgaben === "yes" &&
      context.ausgabensituation?.medicalReasons === CheckboxValue.on,
    hasWeitereAusgaben:
      context.hasAusgaben === "yes" &&
      context.ausgaben &&
      context.ausgaben.length > 0,
  };
};

export const getAnwaltStrings = (context: BeratungshilfeFormularContext) => {
  return { hasNoAnwalt: context.anwaltskanzlei !== "yes" };
};

export const eigentumZusammenfassungShowTotalWorthWarnings = (
  context: BeratungshilfeFormularContext,
) => {
  return {
    eigentumTotalWorthLessThan10000: eigentumTotalWorthLessThan10000({
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
