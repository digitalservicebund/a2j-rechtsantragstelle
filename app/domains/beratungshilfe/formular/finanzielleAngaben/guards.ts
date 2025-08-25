import {
  firstArrayIndex,
  isValidArrayIndex,
} from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";
import { eigentumDone } from "./doneFunctions";
import {
  hasStaatlicheLeistungen,
  hasNoStaatlicheLeistungen,
} from "./einkommen/doneFunctions";
import { type BeratungshilfeFinanzielleAngabenUserData } from "./userData";
import { yesNoGuards } from "../../../guards.server";
import type { GenericGuard, Guards } from "../../../guards.server";

export type BeratungshilfeFinanzielleAngabenGuard =
  GenericGuard<BeratungshilfeFinanzielleAngabenUserData>;

export const staatlicheLeistungenIsBuergergeld: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) => context.staatlicheLeistungen === "buergergeld";

export const staatlicheLeistungenIsKeine: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) => context.staatlicheLeistungen === "keine";

export const grundeigentumIsBewohnt: BeratungshilfeFinanzielleAngabenGuard = ({
  context: { pageData, grundeigentum },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return grundeigentum?.at(arrayIndex)?.isBewohnt === "yes";
};

export const hasAnyEigentumExceptBankaccount: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    context.hasGeldanlage == "yes" ||
    context.hasWertsache == "yes" ||
    context.hasGrundeigentum == "yes" ||
    context.hasKraftfahrzeug == "yes";

export const { hasAusgabenYes } = yesNoGuards("hasAusgaben");

export const { hasBankkontoYes } = yesNoGuards("hasBankkonto");

export const { hasGeldanlageYes } = yesNoGuards("hasGeldanlage");

export const { hasGrundeigentumYes } = yesNoGuards("hasGrundeigentum");

export const { hasKinderYes } = yesNoGuards("hasKinder");
export const hasKinderYesAndEmptyArray: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    hasKinderYes({ context }) && !arrayIsNonEmpty(context.kinder);

export const { hasKraftfahrzeugYes } = yesNoGuards("hasKraftfahrzeug");
export const hasPartnerschaftNoOrWidowed: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    context.partnerschaft === "no" || context.partnerschaft === "widowed";

export const hasPartnerschaftYes: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) => context.partnerschaft === "yes";

export const hasPartnerschaftYesAndPartnerEinkommenYes: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    hasPartnerschaftYes({ context }) && context.partnerEinkommen == "yes";

export const hasPartnerschaftYesAndZusammenlebenNo: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    hasPartnerschaftYes({ context }) && context.zusammenleben == "no";

export const hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    hasPartnerschaftYesAndZusammenlebenNo({ context }) &&
    context.unterhalt == "no";

export const hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    hasPartnerschaftYes({ context }) &&
    context.zusammenleben == "no" &&
    context.unterhalt === "yes";

export const hasPartnerschaftYesAndZusammenlebenYes: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    hasPartnerschaftYes({ context }) && context.zusammenleben == "yes";

export const { hasWeitereUnterhaltszahlungenYes } = yesNoGuards(
  "hasWeitereUnterhaltszahlungen",
);

export const hasWeitereUnterhaltszahlungenYesAndEmptyArray: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    hasWeitereUnterhaltszahlungenYes({ context }) &&
    !arrayIsNonEmpty(context.unterhaltszahlungen);

export const { hasWertsacheYes } = yesNoGuards("hasWertsache");

export const isGeldanlageBargeld: BeratungshilfeFinanzielleAngabenGuard = ({
  context: { pageData, geldanlagen },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return geldanlagen?.at(arrayIndex)?.art === "bargeld";
};

export const isGeldanlageBefristet: BeratungshilfeFinanzielleAngabenGuard = ({
  context: { pageData, geldanlagen },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return geldanlagen?.at(arrayIndex)?.art === "befristet";
};

export const isGeldanlageForderung: BeratungshilfeFinanzielleAngabenGuard = ({
  context: { pageData, geldanlagen },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return geldanlagen?.at(arrayIndex)?.art === "forderung";
};

export const isGeldanlageGiroTagesgeldSparkonto: BeratungshilfeFinanzielleAngabenGuard =
  ({ context: { pageData, geldanlagen } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return geldanlagen?.at(arrayIndex)?.art === "giroTagesgeldSparkonto";
  };

export const isGeldanlageGuthabenkontoKrypto: BeratungshilfeFinanzielleAngabenGuard =
  ({ context: { pageData, geldanlagen } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return geldanlagen?.at(arrayIndex)?.art === "guthabenkontoKrypto";
  };

export const isGeldanlageSonstiges: BeratungshilfeFinanzielleAngabenGuard = ({
  context: { pageData, geldanlagen },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return geldanlagen?.at(arrayIndex)?.art === "sonstiges";
};

export const isGeldanlageWertpapiere: BeratungshilfeFinanzielleAngabenGuard = ({
  context: { pageData, geldanlagen },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return geldanlagen?.at(arrayIndex)?.art === "wertpapiere";
};

export const isKraftfahrzeugWertAbove10000OrUnsure: BeratungshilfeFinanzielleAngabenGuard =
  ({ context: { pageData, kraftfahrzeuge } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    const wert = kraftfahrzeuge?.at(arrayIndex)?.wert;
    return wert === "over10000" || wert === "unsure";
  };

export const isValidKinderArrayIndex: BeratungshilfeFinanzielleAngabenGuard = ({
  context: { pageData, kinder },
}) => isValidArrayIndex(kinder, pageData);

export const kindEigeneEinnahmenYes: BeratungshilfeFinanzielleAngabenGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return kinder?.at(arrayIndex)?.eigeneEinnahmen === "yes";
};

export const kindUnterhaltNo: BeratungshilfeFinanzielleAngabenGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return kinder?.at(arrayIndex)?.unterhalt === "no";
};
export const kindUnterhaltYes: BeratungshilfeFinanzielleAngabenGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return kinder?.at(arrayIndex)?.unterhalt === "yes";
};

export const kindWohnortBeiAntragstellerNo: BeratungshilfeFinanzielleAngabenGuard =
  ({ context: { pageData, kinder } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return kinder?.at(arrayIndex)?.wohnortBeiAntragsteller === "no";
  };

export const kindWohnortBeiAntragstellerYes: BeratungshilfeFinanzielleAngabenGuard =
  ({ context: { pageData, kinder } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    const kinderWohnortBeiAntragsteller =
      kinder?.at(arrayIndex)?.wohnortBeiAntragsteller;
    return (
      kinderWohnortBeiAntragsteller === "yes" ||
      kinderWohnortBeiAntragsteller === "partially"
    );
  };

export const finanzielleAngabeGuards = {
  eigentumDone,
  staatlicheLeistungenIsKeine,
  staatlicheLeistungenIsBuergergeld,
  staatlicheLeistungenIsBuergergeldAndEigentumDone: ({ context }) =>
    staatlicheLeistungenIsBuergergeld({ context }) && eigentumDone({ context }),
  staatlicheLeistungenIsBuergergeldAndHasEigentum: ({ context }) =>
    staatlicheLeistungenIsBuergergeld({ context }) &&
    hasAnyEigentumExceptBankaccount({ context }),
  hasStaatlicheLeistungen,
  hasNoStaatlicheLeistungen,
  hasPartnerschaftYesAndNoStaatlicheLeistungen: ({ context }) =>
    context.partnerschaft === "yes" && !hasStaatlicheLeistungen({ context }),
  hasPartnerschaftYes,
  hasPartnerschaftNoOrWidowed,
  hasPartnerschaftYesAndPartnerEinkommenYes,
  hasPartnerschaftYesAndZusammenlebenYes,
  hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes,
  hasPartnerschaftYesAndZusammenlebenNo,
  hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo,
  ...yesNoGuards("erwerbstaetig"),
  ...yesNoGuards("zusammenleben"),
  ...yesNoGuards("unterhalt"),
  ...yesNoGuards("partnerEinkommen"),
  hasAusgabenYes,
  hasBankkontoYes,
  hasKraftfahrzeugYes,
  hasGeldanlageYes,
  hasGrundeigentumYes,
  hasWertsacheYes,
  hasKinderYes,
  hasWeitereUnterhaltszahlungenYes,
  hasZahlungsfristYes: ({ context: { pageData, ausgaben } }) => {
    const arrayIndex = firstArrayIndex(pageData);
    if (arrayIndex === undefined) return false;
    return ausgaben?.at(arrayIndex)?.hasZahlungsfrist === "yes";
  },
  kindWohnortBeiAntragstellerYes,
  kindWohnortBeiAntragstellerNo,
  kindEigeneEinnahmenYes,
  kindUnterhaltYes,
  kindUnterhaltNo,
  isValidKinderArrayIndex,
  isValidAusgabenArrayIndex: ({ context: { pageData, ausgaben } }) =>
    isValidArrayIndex(ausgaben, pageData),
  livesAlone: ({ context }) => context.livingSituation === "alone",
  livesNotAlone: ({ context }) =>
    context.livingSituation === "withRelatives" ||
    context.livingSituation === "withOthers",
  hasAnyEigentumExceptBankaccount,
  isGeldanlageBargeld,
  isGeldanlageWertpapiere,
  isGeldanlageGuthabenkontoKrypto,
  isGeldanlageGiroTagesgeldSparkonto,
  isGeldanlageBefristet,
  isGeldanlageForderung,
  isGeldanlageSonstiges,
  isKraftfahrzeugWertAbove10000OrUnsure,
  grundeigentumIsBewohnt,
  hasAusgabenYesAndEmptyArray: ({ context }) =>
    hasAusgabenYes({ context }) && !arrayIsNonEmpty(context.ausgaben),
  hasKinderYesAndEmptyArray,
  hasWeitereUnterhaltszahlungenYesAndEmptyArray,
} satisfies Guards<BeratungshilfeFinanzielleAngabenUserData>;
