import {
  firstArrayIndex,
  isValidArrayIndex,
} from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";
import { type BeratungshilfeFinanzielleAngabenGuard } from "./BeratungshilfeFinanzielleAngabenGuardType";
import { yesNoGuards } from "~/domains/guards.server";
import { kinderArraySchema } from "./kinder/pages";

const hasStaatlicheLeistungen: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.staatlicheLeistungen === "asylbewerberleistungen" ||
  context.staatlicheLeistungen === "buergergeld" ||
  context.staatlicheLeistungen === "grundsicherung";

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

export const { hasGrundeigentumYes } = yesNoGuards("hasGrundeigentum");

export const hasKinderYesAndEmptyArray: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    context.hasKinder === "yes" &&
    !kinderArraySchema.safeParse(context.kinder).success;

export const { hasKraftfahrzeugYes } = yesNoGuards("hasKraftfahrzeug");

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
    hasPartnerschaftYesAndZusammenlebenNo({ context }) &&
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
  const kind = kinder?.at(arrayIndex);
  if (kind && "eigeneEinnahmen" in kind) return kind.eigeneEinnahmen === "yes";
  return false;
};

export const kindUnterhaltNo: BeratungshilfeFinanzielleAngabenGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  const kind = kinder?.at(arrayIndex);
  if (kind && "unterhalt" in kind) return kind.unterhalt === "no";
  return false;
};
export const kindUnterhaltYes: BeratungshilfeFinanzielleAngabenGuard = ({
  context: { pageData, kinder },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  const kind = kinder?.at(arrayIndex);
  if (kind && "unterhalt" in kind) return kind.unterhalt === "yes";
  return false;
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

export const hasPartnerschaftYesAndNoStaatlicheLeistungen: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    context.partnerschaft === "yes" && !hasStaatlicheLeistungen({ context });

export const livesAlone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) => context.livingSituation === "alone";

export const livesNotAlone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.livingSituation === "withRelatives" ||
  context.livingSituation === "withOthers";

export const isValidAusgabenArrayIndex: BeratungshilfeFinanzielleAngabenGuard =
  ({ context: { pageData, ausgaben } }) =>
    isValidArrayIndex(ausgaben, pageData);

export const hasAusgabenYesAndEmptyArray: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    context.hasAusgaben === "yes" && !arrayIsNonEmpty(context.ausgaben);

export const hasZahlungsfristYes: BeratungshilfeFinanzielleAngabenGuard = ({
  context: { pageData, ausgaben },
}) => {
  const arrayIndex = firstArrayIndex(pageData);
  if (arrayIndex === undefined) return false;
  return ausgaben?.at(arrayIndex)?.hasZahlungsfrist === "yes";
};
