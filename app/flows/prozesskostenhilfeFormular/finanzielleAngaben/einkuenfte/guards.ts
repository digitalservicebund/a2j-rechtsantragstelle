import type { Guards } from "~/flows/guards.server";
import type { ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/context";
import { isValidArrayIndex } from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";

export const hasStaatlicheLeistungen: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>[string] =
  ({ context }) =>
    context.staatlicheLeistungenPKH === "asylbewerberleistungen" ||
    context.staatlicheLeistungenPKH === "grundsicherung";

export const notEmployed: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>[string] =
  ({ context }) => context.currentlyEmployed === "no";

const hasAndereArbeitsausgaben: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>[string] =
  ({ context }) => context.hasArbeitsausgaben === "yes";

const hasFurtherIncome: Guards<ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext>[string] =
  ({ context: { hasFurtherIncome } }) => hasFurtherIncome === "yes";

export const finanzielleAngabeEinkuenfteGuards = {
  hasStaatlicheLeistungen,
  hasBuergergeld: ({ context }) =>
    context.staatlicheLeistungenPKH === "buergergeld",
  hasArbeitslosengeld: ({ context }) =>
    context.staatlicheLeistungenPKH === "arbeitslosengeld",
  notEmployed,
  isEmployee: ({ context }) =>
    context.employmentType === "employed" ||
    context.employmentType === "employedAndSelfEmployed",
  isSelfEmployed: ({ context }) =>
    context.employmentType === "selfEmployed" ||
    context.employmentType === "employedAndSelfEmployed",
  usesPublicTransit: ({ context }) => context.arbeitsWeg === "publicTransport",
  usesPrivateVehicle: ({ context }) => context.arbeitsWeg === "privateVehicle",
  commuteMethodPlaysNoRole: ({ context }) =>
    context.arbeitsWeg === "bike" || context.arbeitsWeg === "walking",
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
