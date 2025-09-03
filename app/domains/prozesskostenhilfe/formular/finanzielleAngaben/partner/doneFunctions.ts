import { type GenericGuard } from "~/domains/guards.server";
import { partnerEinkuenfteGuards } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/guards";
import { type PartnerEinkuenfteUserData } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/partner/userData";
import { objectKeysNonEmpty } from "~/util/objectKeysNonEmpty";

type PartnerEinkuenfteGuard = GenericGuard<PartnerEinkuenfteUserData>;

export const partnerStaatlicheLeistungenDone: PartnerEinkuenfteGuard = ({
  context,
}) =>
  context["partner-staatlicheLeistungen"] === "asylbewerberleistungen" ||
  context["partner-staatlicheLeistungen"] === "grundsicherung" ||
  context["partner-staatlicheLeistungen"] === "keine" ||
  (partnerEinkuenfteGuards.staatlicheLeistungenIsBuergergeld({ context }) &&
    context["partner-buergergeld"] !== undefined) ||
  (partnerEinkuenfteGuards.staatlicheLeistungenIsArbeitslosengeld({
    context,
  }) &&
    context["partner-arbeitslosengeld"] !== undefined);

export const partnerEinkommenDone: PartnerEinkuenfteGuard = ({ context }) => {
  const partnerEmployeeIncomeComplete =
    context["partner-nettoEinkuenfteAlsArbeitnehmer"] !== undefined;
  const partnerSelfEmployedIncomeComplete = objectKeysNonEmpty(context, [
    "partner-selbststaendigMonatlichesEinkommen",
    "partner-selbststaendigBruttoNetto",
    "partner-selbststaendigAbzuege",
  ]);
  switch (context["partner-employmentType"]) {
    case "employedAndSelfEmployed":
      return partnerEmployeeIncomeComplete && partnerSelfEmployedIncomeComplete;
    case "selfEmployed":
      return partnerSelfEmployedIncomeComplete;
    case "employed":
    case undefined:
      return partnerEmployeeIncomeComplete;
  }
};

export const partnerArbeitDone: PartnerEinkuenfteGuard = ({ context }) =>
  partnerEinkuenfteGuards.notEmployed({ context }) ||
  partnerEinkommenDone({ context });

export const partnerPensionDone: PartnerEinkuenfteGuard = ({ context }) => {
  if (context["partner-receivesPension"] === undefined) return false;
  return partnerEinkuenfteGuards.receivesPension({ context })
    ? context["partner-pensionAmount"] !== undefined
    : true;
};

export const partnerLeistungenDone: PartnerEinkuenfteGuard = ({ context }) => {
  if (context.partnerLeistungen === undefined) return false;
  if (
    partnerEinkuenfteGuards.hasWohngeld({ context }) &&
    context["partner-wohngeldAmount"] === undefined
  )
    return false;
  if (
    partnerEinkuenfteGuards.hasKrankengeld({ context }) &&
    context["partner-krankengeldAmount"] === undefined
  )
    return false;
  if (
    partnerEinkuenfteGuards.hasElterngeld({ context }) &&
    context["partner-elterngeldAmount"] === undefined
  )
    return false;
  if (
    partnerEinkuenfteGuards.hasKindergeld({ context }) &&
    context["partner-kindergeldAmount"] === undefined
  )
    return false;
  return true;
};

export const partnerFurtherIncomeDone: PartnerEinkuenfteGuard = ({ context }) =>
  context["partner-hasFurtherIncome"] !== undefined &&
  !partnerEinkuenfteGuards.hasFurtherIncomeAndEmptyArray({ context });

export const partnerEinkuenfteDone: PartnerEinkuenfteGuard = ({ context }) =>
  (context["partner-staatlicheLeistungen"] !== undefined &&
    partnerEinkuenfteGuards.hasGrundsicherungOrAsylbewerberleistungen({
      context,
    })) ||
  (partnerStaatlicheLeistungenDone({ context }) &&
    partnerArbeitDone({ context }) &&
    partnerPensionDone({ context }) &&
    partnerLeistungenDone({ context }) &&
    partnerFurtherIncomeDone({ context }));
