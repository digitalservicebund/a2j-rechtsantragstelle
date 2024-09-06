import type { Guards } from "~/flows/guards.server";
import type { ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/context";
import {
  staatlicheLeistungenIsBuergergeld,
  staatlicheLeistungenIsBuergergeldAndHasAnyEigentum,
  staatlicheLeistungenIsKeine,
} from "~/flows/shared/finanzielleAngaben/guards";
import { isValidArrayIndex } from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";

const hasAndereArbeitsausgaben: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>[string] =
  ({ context }) => context.hasArbeitsausgaben === "yes";

const hasFurtherIncome: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>[string] =
  ({ context: { hasFurtherIncome } }) => hasFurtherIncome === "yes";

export const finanzielleAngabeEinkuenfteGuards = {
  hasGrundsicherungOrAsylbewerberleistungen: ({ context }) =>
    context.staatlicheLeistungen === "asylbewerberleistungen" ||
    context.staatlicheLeistungen === "grundsicherung",
  staatlicheLeistungenIsBuergergeld,
  staatlicheLeistungenIsKeine,
  staatlicheLeistungenIsBuergergeldAndHasAnyEigentum,
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
