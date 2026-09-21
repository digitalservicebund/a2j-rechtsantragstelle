import { type FluggastrechteUserData } from "../userData";
import type { Guard } from "~/services/flow/newFlowEngine/types";

const _hasAnnullierung: Guard<FluggastrechteUserData> = (context) =>
  context.bereich === "annullierung";
const _hasAnnullierungWithErsatzflugNo: Guard<FluggastrechteUserData> = (
  context,
) => _hasAnnullierung(context) && context.ersatzflug === "no";

export const fluggastrechteFlugdatenGuards = {
  hasAnnullierungWithErsatzflugYes: (context) =>
    _hasAnnullierung(context) && context.ersatzflug === "yes",
  hasAnnullierungWithErsatzflugNo: (context) =>
    _hasAnnullierungWithErsatzflugNo(context),
  hasNoZwischenstoppAndAnnullierungWithErsatzflugYes: (context) =>
    context.zwischenstoppAnzahl === "no" &&
    _hasAnnullierung(context) &&
    context.ersatzflug === "yes",
  hasNoZwischenstoppAndAnnullierungWithErsatzflugNo: (context) =>
    context.zwischenstoppAnzahl === "no" &&
    _hasAnnullierungWithErsatzflugNo(context),
} satisfies Record<string, Guard<FluggastrechteUserData>>;
