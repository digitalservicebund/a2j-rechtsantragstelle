import type { Guards } from "~/flows/guards.server";
import type { PartnerEinkuenfteContext } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/context";
import type { ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/context";
import {
  staatlicheLeistungenIsBuergergeld,
  staatlicheLeistungenIsKeine,
} from "~/flows/shared/finanzielleAngaben/guards";
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
  receivesSupport: ({ context }) => context.receivesSupport === "yes",
  hasWohngeld: ({ context: { hasWohngeld } }) => hasWohngeld === "on",
  hasKrankengeld: ({ context: { hasKrankengeld } }) => hasKrankengeld === "on",
  hasElterngeld: ({ context: { hasElterngeld } }) => hasElterngeld === "on",
  hasKindergeld: ({ context: { hasKindergeld } }) => hasKindergeld === "on",
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
    isValidArrayIndex(
      context["partner-arbeitsausgaben"],
      context["partner-pageData"],
    ),
  receivesPension: ({ context }) =>
    context["partner-receivesPension"] === "yes",
  receivesSupport: ({ context }) =>
    context["partner-receivesSupport"] === "yes",
  hasWohngeld: ({ context }) => context["partner-hasWohngeld"] === "on",
  hasKrankengeld: ({ context }) => context["partner-hasKrankengeld"] === "on",
  hasElterngeld: ({ context }) => context["partner-hasElterngeld"] === "on",
  hasKindergeld: ({ context }) => context["partner-hasKindergeld"] === "on",
  hasFurtherIncome: partnerHasFurtherIncome,
  hasFurtherIncomeAndEmptyArray: ({ context }) =>
    partnerHasFurtherIncome({ context }) &&
    !arrayIsNonEmpty(context["partner-weitereEinkuenfte"]),
  isValidEinkuenfteArrayIndex: ({ context }) =>
    isValidArrayIndex(
      context["partner-weitereEinkuenfte"],
      context["partner-pageData"],
    ),
} satisfies Guards<PartnerEinkuenfteContext>;
