import type { Guards } from "~/domains/guards.server";
import type { ProzesskostenhilfeFinanzielleAngabenEinkuenfteUserData } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/einkuenfte/userData";
import { type PartnerEinkuenfteUserData } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/partner/userData";
import {
  staatlicheLeistungenIsBuergergeld,
  staatlicheLeistungenIsKeine,
} from "~/domains/shared/formular/finanzielleAngaben/guards";
import { isValidArrayIndex } from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";
import { eigentumDone } from "../doneFunctions";

const partnerHasAndereArbeitsausgaben: Guards<PartnerEinkuenfteUserData>[string] =
  ({ context }) => context["partner-hasArbeitsausgaben"] === "yes";

const hasFurtherIncome: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteUserData>[string] =
  ({ context }) => context.hasFurtherIncome === "yes";

const partnerHasFurtherIncome: Guards<PartnerEinkuenfteUserData>[string] = ({
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
  incomeWithBuergergeld: ({ context }) =>
    context.currentlyEmployed === "yes" &&
    staatlicheLeistungenIsBuergergeld({ context }),
  isEmployee: ({ context }) =>
    context.employmentType === "employed" ||
    context.employmentType === "employedAndSelfEmployed",
  isSelfEmployed: ({ context }) =>
    context.employmentType === "selfEmployed" ||
    context.employmentType === "employedAndSelfEmployed",

  receivesPension: ({ context }) => context.receivesPension === "yes",
  hasWohngeld: ({ context: { leistungen } }) => leistungen?.wohngeld === "on",
  hasKrankengeld: ({ context: { leistungen } }) =>
    leistungen?.krankengeld === "on",
  hasElterngeld: ({ context: { leistungen } }) =>
    leistungen?.elterngeld === "on",
  hasKindergeld: ({ context: { leistungen } }) =>
    leistungen?.kindergeld === "on",
  hasFurtherIncome,
  hasFurtherIncomeAndEmptyArray: ({ context }) =>
    hasFurtherIncome({ context }) &&
    !arrayIsNonEmpty(context.weitereEinkuenfte),
  isValidEinkuenfteArrayIndex: ({
    context: { pageData, weitereEinkuenfte: furtherIncome },
  }) => isValidArrayIndex(furtherIncome, pageData),
} satisfies Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteUserData>;

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
  incomeWithBuergergeld: ({ context }) =>
    context["partner-currentlyEmployed"] === "yes" &&
    context["partner-staatlicheLeistungen"] === "buergergeld",
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
  hasWohngeld: ({ context }) => context.partnerLeistungen?.wohngeld === "on",
  hasKrankengeld: ({ context }) =>
    context.partnerLeistungen?.krankengeld === "on",
  hasElterngeld: ({ context }) =>
    context.partnerLeistungen?.elterngeld === "on",
  hasKindergeld: ({ context }) =>
    context.partnerLeistungen?.kindergeld === "on",
  hasFurtherIncome: partnerHasFurtherIncome,
  hasFurtherIncomeAndEmptyArray: ({ context }) =>
    partnerHasFurtherIncome({ context }) &&
    !arrayIsNonEmpty(context["partner-weitereEinkuenfte"]),
  isValidEinkuenfteArrayIndex: ({ context }) =>
    isValidArrayIndex(context["partner-weitereEinkuenfte"], context.pageData),
} satisfies Guards<PartnerEinkuenfteUserData>;
