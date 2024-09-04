import type { Guards } from "~/flows/guards.server";
import type { ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/context";
import { isValidArrayIndex } from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";

export const hasGrundsicherungOrAsylbewerberleistungen: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>[string] =
  ({ context }) =>
    context.staatlicheLeistungenPKH === "asylbewerberleistungen" ||
    context.staatlicheLeistungenPKH === "grundsicherung";

export const notEmployed: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>[string] =
  ({ context }) => context.currentlyEmployed === "no";

export const isEmployee: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>[string] =
  ({ context }) =>
    context.employmentType === "employed" ||
    context.employmentType === "employedAndSelfEmployed";
export const isSelfEmployed: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>[string] =
  ({ context }) =>
    context.employmentType === "selfEmployed" ||
    context.employmentType === "employedAndSelfEmployed";

export const usesPublicTransit: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>[string] =
  ({ context }) => context.arbeitsweg === "publicTransport";
export const usesPrivateVehicle: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>[string] =
  ({ context }) => context.arbeitsweg === "privateVehicle";

export const hasAndereArbeitsausgaben: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>[string] =
  ({ context }) => context.hasArbeitsausgaben === "yes";

export const hasFurtherIncome: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>[string] =
  ({ context: { hasFurtherIncome } }) => hasFurtherIncome === "yes";

export const finanzielleAngabeEinkuenfteGuards = {
  hasGrundsicherungOrAsylbewerberleistungen,
  hasBuergergeld: ({ context }) =>
    context.staatlicheLeistungenPKH === "buergergeld",
  hasArbeitslosengeld: ({ context }) =>
    context.staatlicheLeistungenPKH === "arbeitslosengeld",
  notEmployed,
  isEmployee,
  isSelfEmployed,
  usesPublicTransit,
  usesPrivateVehicle,
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
