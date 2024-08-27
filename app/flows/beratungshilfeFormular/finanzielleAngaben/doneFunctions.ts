import { hasAnyEigentumExceptBankaccount } from "~/flows/shared/finanzielleAngaben/guards";
import { arrayIsNonEmpty } from "~/util/array";
import { type BeratungshilfeFinanzielleAngabenGuard } from "./guards";

export const einkommenDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  (context.staatlicheLeistungen != undefined &&
    hasStaatlicheLeistungen({ context })) ||
  context.einkommen != undefined;

export const partnerDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  (context.staatlicheLeistungen != undefined &&
    hasStaatlicheLeistungen({ context })) ||
  ["no", "widowed"].includes(context.partnerschaft ?? "") ||
  context.unterhalt == "no" ||
  context.partnerEinkommen == "no" ||
  context.partnerEinkommenSumme != undefined ||
  (context.partnerNachname != undefined && context.partnerVorname != undefined);

const hasStaatlicheLeistungen: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.staatlicheLeistungen == "asylbewerberleistungen" ||
  context.staatlicheLeistungen == "buergergeld" ||
  context.staatlicheLeistungen == "grundsicherung";

export const kinderDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  hasStaatlicheLeistungen({ context }) ||
  context.hasKinder == "no" ||
  arrayIsNonEmpty(context.kinder);

const wohnungAloneDone: BeratungshilfeFinanzielleAngabenGuard = ({ context }) =>
  context.livingSituation === "alone" &&
  context.apartmentCostAlone !== undefined;

const wohnungWithOthersDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  (context.livingSituation === "withOthers" ||
    context.livingSituation === "withRelatives") &&
  context.apartmentPersonCount !== undefined &&
  context.apartmentCostOwnShare !== undefined &&
  context.apartmentCostFull !== undefined;

export const wohnungDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  hasStaatlicheLeistungen({ context }) ||
  (context.livingSituation !== undefined &&
    context.apartmentSizeSqm !== undefined &&
    (wohnungAloneDone({ context }) || wohnungWithOthersDone({ context })));

export const andereUnterhaltszahlungenDone: BeratungshilfeFinanzielleAngabenGuard =
  ({ context }) =>
    (context.staatlicheLeistungen != undefined &&
      hasStaatlicheLeistungen({ context })) ||
    context.hasWeitereUnterhaltszahlungen == "no" ||
    arrayIsNonEmpty(context.unterhaltszahlungen);

export const ausgabenDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) => {
  return (
    hasStaatlicheLeistungen({ context }) ||
    context.hasAusgaben === "no" ||
    (context.hasAusgaben === "yes" && arrayIsNonEmpty(context.ausgaben))
  );
};

export const eigentumDone: BeratungshilfeFinanzielleAngabenGuard = ({
  context,
}) =>
  context.staatlicheLeistungen == "grundsicherung" ||
  context.staatlicheLeistungen == "asylbewerberleistungen" ||
  (context.hasBankkonto !== undefined &&
    context.hasKraftfahrzeug !== undefined &&
    context.hasGeldanlage !== undefined &&
    context.hasGrundeigentum !== undefined &&
    context.hasWertsache !== undefined &&
    (!hasAnyEigentumExceptBankaccount({ context }) ||
      context.eigentumTotalWorth !== undefined));
