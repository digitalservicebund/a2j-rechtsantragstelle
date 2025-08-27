import type { Guards } from "~/domains/guards.server";
import type { ProzesskostenhilfeFinanzielleAngabenAbzuegeUserData } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/abzuege/userData";
import { isValidArrayIndex } from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";

const hasAndereArbeitsausgaben: Guards<ProzesskostenhilfeFinanzielleAngabenAbzuegeUserData>[string] =
  ({ context }) => context.hasArbeitsausgaben === "yes";

export const finanzielleAngabeAbzuegeGuards = {
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
} satisfies Guards<ProzesskostenhilfeFinanzielleAngabenAbzuegeUserData>;
