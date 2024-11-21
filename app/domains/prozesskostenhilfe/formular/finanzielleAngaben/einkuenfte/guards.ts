import { CheckboxValue } from "~/components/inputs/Checkbox";
import type { Guards } from "~/domains/guards.server";
import type { PartnerEinkuenfteContext } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/context";
import type { ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/context";
import {
  staatlicheLeistungenIsBuergergeld,
  staatlicheLeistungenIsKeine,
} from "~/domains/shared/formular/finanzielleAngaben/guards";
import { isValidArrayIndex } from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";
import { eigentumDone } from "../eigentumDone";

const hasAndereArbeitsausgaben: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>[string] =
  ({ context }) => context.hasArbeitsausgaben === "yes";

const partnerHasAndereArbeitsausgaben: Guards<PartnerEinkuenfteContext>[string] =
  ({ context }) => context["partner-hasArbeitsausgaben"] === "yes";

const hasFurtherIncome: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>[string] =
  ({ context }) => context.hasFurtherIncome === "yes";

const partnerHasFurtherIncome: Guards<PartnerEinkuenfteContext>[string] = ({
  context,
}) => context["partner-hasFurtherIncome"] === "yes";

export const finanzielleAngabeEinkuenfteGuards = {
  hasGrundsicherungOrAsylbewerberleistungen: ({ context }) =>
    context.staatlicheLeistungen === "asylbewerberleistungen" ||
    context.staatlicheLeistungen === "grundsicherung",
  staatlicheLeistungenIsBuergergeld,
  staatlicheLeistungenIsKeine,
  staatlicheLeistungenIsBuergergeldAndEigentumDone: ({ context }) =>
    staatlicheLeistungenIsBuergergeld({ context }) && eigentumDone({ context }),
  staatlicheLeistungenIsArbeitslosengeld: ({ context }) =>
    context.staatlicheLeistungen === "arbeitslosengeld",
  notEmployed: ({ context }) => context.currentlyEmployed === "no",
  isEmployee: ({ context }) =>
    context.employmentType === "employed" ||
    context.employmentType === "employedAndSelfEmployed",
  isSelfEmployed: ({ context }) =>
    context.employmentType === "selfEmployed" ||
    context.employmentType === "employedAndSelfEmployed",
  usesPublicTransit: ({ context }) => context.arbeitsweg === "publicTransport",
  usesPrivateVehicle: ({ context }) => context.arbeitsweg === "privateVehicle",
  commuteMethodPlaysNoRole: ({ context }) =>
    context.arbeitsweg === "bike" || context.arbeitsweg === "walking",
  hasAndereArbeitsausgaben,
  hasAndereArbeitsausgabenAndEmptyArray: ({ context }) =>
    hasAndereArbeitsausgaben({ context }) &&
    !arrayIsNonEmpty(context.arbeitsausgaben),
  isValidArbeitsausgabenArrayIndex: ({
    context: { pageData, arbeitsausgaben },
  }) => isValidArrayIndex(arbeitsausgaben, pageData),
  receivesPension: ({ context }) => context.receivesPension === "yes",
  hasWohngeld: ({ context: { hasWohngeld } }) =>
    hasWohngeld === CheckboxValue.on,
  hasKrankengeld: ({ context: { hasKrankengeld } }) =>
    hasKrankengeld === CheckboxValue.on,
  hasElterngeld: ({ context: { hasElterngeld } }) =>
    hasElterngeld === CheckboxValue.on,
  hasKindergeld: ({ context: { hasKindergeld } }) =>
    hasKindergeld === CheckboxValue.on,
  hasFurtherIncome,
  hasFurtherIncomeAndEmptyArray: ({ context }) =>
    hasFurtherIncome({ context }) &&
    !arrayIsNonEmpty(context.weitereEinkuenfte),
  isValidEinkuenfteArrayIndex: ({
    context: { pageData, weitereEinkuenfte: furtherIncome },
  }) => isValidArrayIndex(furtherIncome, pageData),
} satisfies Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>;

export const partnerEinkuenfteGuards = {
  hasGrundsicherungOrAsylbewerberleistungen: ({ context }) =>
    context["partner-staatlicheLeistungen"] === "asylbewerberleistungen" ||
    context["partner-staatlicheLeistungen"] === "grundsicherung",
  staatlicheLeistungenIsBuergergeld: ({ context }) =>
    context["partner-staatlicheLeistungen"] === "buergergeld",
  staatlicheLeistungenIsKeine: ({ context }) =>
    context["partner-staatlicheLeistungen"] === "keine",
  staatlicheLeistungenIsArbeitslosengeld: ({ context }) =>
    context["partner-staatlicheLeistungen"] === "arbeitslosengeld",
  notEmployed: ({ context }) => context["partner-currentlyEmployed"] === "no",
  isEmployee: ({ context }) =>
    context["partner-employmentType"] === "employed" ||
    context["partner-employmentType"] === "employedAndSelfEmployed",
  isSelfEmployed: ({ context }) =>
    context["partner-employmentType"] === "selfEmployed" ||
    context["partner-employmentType"] === "employedAndSelfEmployed",
  usesPublicTransit: ({ context }) =>
    context["partner-arbeitsweg"] === "publicTransport",
  usesPrivateVehicle: ({ context }) =>
    context["partner-arbeitsweg"] === "privateVehicle",
  commuteMethodPlaysNoRole: ({ context }) =>
    context["partner-arbeitsweg"] === "bike" ||
    context["partner-arbeitsweg"] === "walking",
  hasAndereArbeitsausgaben: partnerHasAndereArbeitsausgaben,
  hasAndereArbeitsausgabenAndEmptyArray: ({ context }) =>
    partnerHasAndereArbeitsausgaben({ context }) &&
    !arrayIsNonEmpty(context["partner-arbeitsausgaben"]),
  isValidArbeitsausgabenArrayIndex: ({ context }) =>
    isValidArrayIndex(context["partner-arbeitsausgaben"], context.pageData),
  receivesPension: ({ context }) =>
    context["partner-receivesPension"] === "yes",
  receivesSupport: ({ context }) =>
    context["partner-receivesSupport"] === "yes",
  hasWohngeld: ({ context }) =>
    context["partner-hasWohngeld"] === CheckboxValue.on,
  hasKrankengeld: ({ context }) =>
    context["partner-hasKrankengeld"] === CheckboxValue.on,
  hasElterngeld: ({ context }) =>
    context["partner-hasElterngeld"] === CheckboxValue.on,
  hasKindergeld: ({ context }) =>
    context["partner-hasKindergeld"] === CheckboxValue.on,
  hasFurtherIncome: partnerHasFurtherIncome,
  hasFurtherIncomeAndEmptyArray: ({ context }) =>
    partnerHasFurtherIncome({ context }) &&
    !arrayIsNonEmpty(context["partner-weitereEinkuenfte"]),
  isValidEinkuenfteArrayIndex: ({ context }) =>
    isValidArrayIndex(context["partner-weitereEinkuenfte"], context.pageData),
} satisfies Guards<PartnerEinkuenfteContext>;
