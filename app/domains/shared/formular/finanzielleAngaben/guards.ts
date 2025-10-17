import type { BeratungshilfeFinanzielleAngabenUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/userData";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/userData";
import {
  firstArrayIndex,
  isValidArrayIndex,
} from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";
import { type GenericGuard, yesNoGuards } from "../../../guards.server";

export type FinanzielleAngabenGuard = GenericGuard<
  | ProzesskostenhilfeFinanzielleAngabenUserData
  | BeratungshilfeFinanzielleAngabenUserData
>;
export const staatlicheLeistungenIsBuergergeld: FinanzielleAngabenGuard = ({
  context,
}) => context.staatlicheLeistungen === "buergergeld";

export const staatlicheLeistungenIsKeine: FinanzielleAngabenGuard = ({
  context,
}) => context.staatlicheLeistungen === "keine";

export const hasPartnerschaftYesAndZusammenlebenNo: FinanzielleAngabenGuard = ({
  context,
}) => hasPartnerschaftYes({ context }) && context.zusammenleben == "no";

export const { hasWeitereUnterhaltszahlungenYes } = yesNoGuards(
  "hasWeitereUnterhaltszahlungen",
);
export const { hasKraftfahrzeugYes } = yesNoGuards("hasKraftfahrzeug");
export const { hasGrundeigentumYes } = yesNoGuards("hasGrundeigentum");
export const { hasWertsacheYes } = yesNoGuards("hasWertsache");
export const hasPartnerschaftYes: FinanzielleAngabenGuard = ({ context }) =>
  context.partnerschaft === "yes";
export const hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes: FinanzielleAngabenGuard =
  ({ context }) =>
    hasPartnerschaftYes({ context }) &&
    context.zusammenleben == "no" &&
    context.unterhalt === "yes";
export const hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo: FinanzielleAngabenGuard =
  ({ context }) =>
    hasPartnerschaftYesAndZusammenlebenNo({ context }) &&
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
