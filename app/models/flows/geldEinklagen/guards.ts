import { isPartnerCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import type { GeldEinklagenVorabcheckContext } from "./context";
import type { Guards } from "../guards.server";

function yesNoGuards<Field extends keyof GeldEinklagenVorabcheckContext>(
  field: Field,
): { [field in Field as `${field}Yes`]: Guards[string] } & {
  [field in Field as `${field}No`]: Guards[string];
} {
  //@ts-ignore
  return {
    [`${field}Yes`]: ({ context }) => context[field] === "yes",
    [`${field}No`]: ({ context }) => context[field] === "no",
  } satisfies Guards<GeldEinklagenVorabcheckContext>;
}

const privatpersonEligible: Guards<GeldEinklagenVorabcheckContext>[string] = ({
  context,
}) => ["yes", "nonSingle", "representing"].includes(context.privatperson ?? "");
const yesNoGuardsFlug = yesNoGuards("flug");

export const guards = {
  ...yesNoGuards("kontaktaufnahme"),
  ...yesNoGuards("fristAbgelaufen"),
  fristAbgelaufenNotSet: ({ context }) => context.fristAbgelaufen === "notSet",
  privatpersonNotEligible: ({ context }) =>
    ["nonPrivate", "organisation"].includes(context.privatperson ?? ""),
  privatpersonEligibleAndFlugYes: ({ context }) =>
    privatpersonEligible({ context }) && yesNoGuardsFlug.flugYes({ context }),
  privatpersonEligible,
  forderungOnlyMoney: ({ context }) => context.forderung === "money",
  forderungNotOnlyMoney: ({ context }) =>
    Boolean(context.forderung && context.forderung !== "money"),
  bereichFamily: ({ context }) => context.bereich === "family",
  bereichWork: ({ context }) => context.bereich === "work",
  bereichTravel: ({ context }) => context.bereich === "travel",
  bereichLiving: ({ context }) => context.bereich === "living",
  bereichTax: ({ context }) => context.bereich === "tax",
  bereichFilled: ({ context }) => !!context.bereich,
  ...yesNoGuardsFlug,
  ...yesNoGuards("gegenseitePersonDeutschland"),
  ...yesNoGuards("gegenseiteUnternehmenDeutschland"),
  ...yesNoGuards("bundIdAccount"),
  ...yesNoGuards("wohnraeume"),
  bundIdAccountWantTo: ({ context }) => context.bundIdAccount === "wantTo",
  gegenseiteMultiple: ({ context }) => context.gegenseite === "multiple",
  gegenseitePrivatperson: ({ context }) =>
    context.gegenseite === "privatperson",
  gegenseiteUnternehmen: ({ context }) => context.gegenseite === "unternehmen",
  geldspanneBelow5k: ({ context }) => context.geldspanne !== "above_5000",
  geldspanneAbove5k: ({ context }) => context.geldspanne === "above_5000",
  geldspanneWithoutClaim: ({ context }) => context.geldspanne === "no",
  gegenseiteUnternehmenPlzPartnerCourt: ({ context }) =>
    isPartnerCourt(context.gegenseiteUnternehmenPlz),
  gegenseitePersonPlzPartnerCourt: ({ context }) =>
    isPartnerCourt(context.gegenseitePersonPlz),
  schadenPlzPartnerCourt: ({ context }) => isPartnerCourt(context.schadenPlz),
  ortLeistungPlzPartnerCourt: ({ context }) =>
    isPartnerCourt(context.ortLeistungPlz),
  wohnraumPlzPartnerCourt: ({ context }) => isPartnerCourt(context.wohnraumPlz),
  wasUnerlaubteHandlung: ({ context }) => context.bereich === "violation",
  ...yesNoGuards("gegenseiteKontakt"),
  ...yesNoGuards("gegenseiteFrist"),
  digitalAusweisenNo: ({ context }) => context.digitalAusweisen === "no",
  livingAndWohnraumeYes: ({ context }) =>
    context.bereich === "living" && context.wohnraeume == "yes",
} satisfies Guards<GeldEinklagenVorabcheckContext>;
