import type { BeratungshilfeFinanzielleAngaben } from "~/flows/beratungshilfeFormular/finanzielleAngaben/context";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/context";
import {
  firstArrayIndex,
  isValidArrayIndex,
} from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";
import { type GenericGuard, yesNoGuards } from "../../guards.server";

export type FinanzielleAngabenGuard = GenericGuard<
  ProzesskostenhilfeFinanzielleAngabenContext | BeratungshilfeFinanzielleAngaben
>;

export const hasPartnerschaftOrSeparated: FinanzielleAngabenGuard = ({
  context,
}) => context.partnerschaft === "yes" || context.partnerschaft === "separated";

export const hasPartnerschaftOrSeparatedAndZusammenlebenNo: FinanzielleAngabenGuard =
  ({ context }) =>
    hasPartnerschaftOrSeparated({ context }) && context.zusammenleben == "no";

export const { hasAusgabenYes } = yesNoGuards("hasAusgaben");
export const { hasKinderYes } = yesNoGuards("hasKinder");
export const { hasWeitereUnterhaltszahlungenYes } = yesNoGuards(
  "hasWeitereUnterhaltszahlungen",
);
export const { hasBankkontoYes } = yesNoGuards("hasBankkonto");
export const { hasKraftfahrzeugYes } = yesNoGuards("hasKraftfahrzeug");
export const { hasGeldanlageYes } = yesNoGuards("hasGeldanlage");
export const { hasGrundeigentumYes } = yesNoGuards("hasGrundeigentum");
export const { hasWertsacheYes } = yesNoGuards("hasWertsache");
export const hasPartnerschaftYes: FinanzielleAngabenGuard = ({ context }) =>
  context.partnerschaft === "yes";
export const hasPartnerschaftNoOrWidowed: FinanzielleAngabenGuard = ({
  context,
}) => context.partnerschaft === "no" || context.partnerschaft === "widowed";
export const hasPartnerschaftOrSeparatedAndPartnerEinkommenYes: FinanzielleAngabenGuard =
  ({ context }) =>
    hasPartnerschaftOrSeparated({ context }) &&
    context.partnerEinkommen == "yes";
export const hasPartnerschaftOrSeparatedAndZusammenlebenYes: FinanzielleAngabenGuard =
  ({ context }) =>
    hasPartnerschaftOrSeparated({ context }) && context.zusammenleben == "yes";
export const hasPartnerschaftOrSeparatedAndZusammenlebenNoAndUnterhaltYes: FinanzielleAngabenGuard =
  ({ context }) =>
    hasPartnerschaftOrSeparated({ context }) &&
    context.zusammenleben == "no" &&
    context.unterhalt === "yes";
export const hasPartnerschaftOrSeparatedAndZusammenlebenNoAndUnterhaltNo: FinanzielleAngabenGuard =
  ({ context }) =>
    hasPartnerschaftOrSeparatedAndZusammenlebenNo({ context }) &&
    context.unterhalt == "no";
export const isPartnerschaftZusammenlebenEinkommenNo: FinanzielleAngabenGuard =
  ({ context }) =>
    context.partnerschaft === "yes" &&
    context.zusammenleben === "yes" &&
    context.partnerEinkommen === "no";
export const isPartnerschaftZusammenlebenEinkommenYes: FinanzielleAngabenGuard =
  ({ context }) =>
    context.partnerschaft === "yes" &&
    context.zusammenleben === "yes" &&
    context.partnerEinkommen === "yes";
export const kindWohnortBeiAntragstellerYes: FinanzielleAngabenGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  const kinderWohnortBeiAntragsteller =
    kinder?.at(arrayIndex)?.wohnortBeiAntragsteller;
  return (
    kinderWohnortBeiAntragsteller === "yes" ||
    kinderWohnortBeiAntragsteller === "partially"
  );
};
export const kindWohnortBeiAntragstellerNo: FinanzielleAngabenGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return kinder?.at(arrayIndex)?.wohnortBeiAntragsteller === "no";
};
export const kindEigeneEinnahmenYes: FinanzielleAngabenGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return kinder?.at(arrayIndex)?.eigeneEinnahmen === "yes";
};
export const kindUnterhaltYes: FinanzielleAngabenGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return kinder?.at(arrayIndex)?.unterhalt === "yes";
};
export const kindUnterhaltNo: FinanzielleAngabenGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return kinder?.at(arrayIndex)?.unterhalt === "no";
};
export const isValidKinderArrayIndex: FinanzielleAngabenGuard = ({
  context: { pageData, kinder },
}) => isValidArrayIndex(kinder, pageData);
export const isGeldanlageBargeld: FinanzielleAngabenGuard = ({
  context: { pageData, geldanlagen },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return geldanlagen?.at(arrayIndex)?.art === "bargeld";
};
export const isGeldanlageWertpapiere: FinanzielleAngabenGuard = ({
  context: { pageData, geldanlagen },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return geldanlagen?.at(arrayIndex)?.art === "wertpapiere";
};
export const isGeldanlageGuthabenkontoKrypto: FinanzielleAngabenGuard = ({
  context: { pageData, geldanlagen },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return geldanlagen?.at(arrayIndex)?.art === "guthabenkontoKrypto";
};
export const isGeldanlageGiroTagesgeldSparkonto: FinanzielleAngabenGuard = ({
  context: { pageData, geldanlagen },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return geldanlagen?.at(arrayIndex)?.art === "giroTagesgeldSparkonto";
};
export const isGeldanlageBefristet: FinanzielleAngabenGuard = ({
  context: { pageData, geldanlagen },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return geldanlagen?.at(arrayIndex)?.art === "befristet";
};
export const isGeldanlageForderung: FinanzielleAngabenGuard = ({
  context: { pageData, geldanlagen },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return geldanlagen?.at(arrayIndex)?.art === "forderung";
};
export const isGeldanlageSonstiges: FinanzielleAngabenGuard = ({
  context: { pageData, geldanlagen },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return geldanlagen?.at(arrayIndex)?.art === "sonstiges";
};
export const isKraftfahrzeugWertAbove10000OrUnsure: FinanzielleAngabenGuard = ({
  context: { pageData, kraftfahrzeuge },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  const wert = kraftfahrzeuge?.at(arrayIndex)?.wert;
  return wert === "over10000" || wert === "unsure";
};
export const grundeigentumIsBewohnt: FinanzielleAngabenGuard = ({
  context: { pageData, grundeigentum },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return grundeigentum?.at(arrayIndex)?.isBewohnt === "yes";
};
export const hasKinderYesAndEmptyArray: FinanzielleAngabenGuard = ({
  context,
}) => hasKinderYes({ context }) && !arrayIsNonEmpty(context.kinder);
export const hasWeitereUnterhaltszahlungenYesAndEmptyArray: FinanzielleAngabenGuard =
  ({ context }) =>
    hasWeitereUnterhaltszahlungenYes({ context }) &&
    !arrayIsNonEmpty(context.unterhaltszahlungen);
