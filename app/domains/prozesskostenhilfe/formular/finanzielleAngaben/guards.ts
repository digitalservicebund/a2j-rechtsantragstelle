import {
  firstArrayIndex,
  isValidArrayIndex,
} from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";
import { type ProzesskostenhilfeFinanzielleAngabenUserData } from "./userData";
import { yesNoGuards, type GenericGuard } from "../../../guards.server";

type FinanzielleAngabenGuard =
  GenericGuard<ProzesskostenhilfeFinanzielleAngabenUserData>;

export const hasKinderYesAndEmptyArray: FinanzielleAngabenGuard = ({
  context,
}) => context.hasKinder === "yes" && !arrayIsNonEmpty(context.kinder);

export const isSonstigeVersicherung: FinanzielleAngabenGuard = ({
  context: { pageData, versicherungen },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return versicherungen?.at(arrayIndex)?.art === "sonstige";
};
export const sonstigeAusgabeAnteiligYes: FinanzielleAngabenGuard = ({
  context: { pageData, sonstigeAusgaben },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return sonstigeAusgaben?.at(arrayIndex)?.zahlungspflichtiger !== "myself";
};
export const ratenzahlungAnteiligYes: FinanzielleAngabenGuard = ({
  context: { pageData, ratenzahlungen },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return ratenzahlungen?.at(arrayIndex)?.zahlungspflichtiger !== "myself";
};

export const { hasWeitereUnterhaltszahlungenYes } = yesNoGuards(
  "hasWeitereUnterhaltszahlungen",
);
export const { hasKraftfahrzeugYes } = yesNoGuards("hasKraftfahrzeug");
export const { hasGrundeigentumYes } = yesNoGuards("hasGrundeigentum");
export const { hasWertsacheYes } = yesNoGuards("hasWertsache");

export const hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes: FinanzielleAngabenGuard =
  ({ context }) =>
    context.partnerschaft === "yes" &&
    context.zusammenleben == "no" &&
    context.unterhalt === "yes";
export const hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo: FinanzielleAngabenGuard =
  ({ context }) =>
    context.partnerschaft === "yes" &&
    context.zusammenleben == "no" &&
    context.unterhalt == "no";
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
  const kind = kinder?.at(arrayIndex);
  if (kind && "eigeneEinnahmen" in kind) return kind.eigeneEinnahmen === "yes";
  return false;
};
export const kindUnterhaltYes: FinanzielleAngabenGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  const kind = kinder?.at(arrayIndex);
  if (kind && "unterhalt" in kind) return kind.unterhalt === "yes";
  return false;
};
export const kindUnterhaltNo: FinanzielleAngabenGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  const kind = kinder?.at(arrayIndex);
  if (kind && "unterhalt" in kind) return kind.unterhalt === "no";
  return false;
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
export const hasWeitereUnterhaltszahlungenYesAndEmptyArray: FinanzielleAngabenGuard =
  ({ context }) =>
    hasWeitereUnterhaltszahlungenYes({ context }) &&
    !arrayIsNonEmpty(context.unterhaltszahlungen);
