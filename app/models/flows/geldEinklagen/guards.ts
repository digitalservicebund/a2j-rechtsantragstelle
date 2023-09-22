import { isPartnerCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import type { GeldEinklagenVorabcheckContext } from "./pages";

type Guard = (context: GeldEinklagenVorabcheckContext) => boolean;

function yesNoGuards<Field extends keyof GeldEinklagenVorabcheckContext>(
  field: Field,
): { [field in Field as `${field}Yes`]: Guard } & {
  [field in Field as `${field}No`]: Guard;
} {
  //@ts-ignore
  return {
    [`${field}Yes`]: ((context) => context[field] === "yes") as Guard,
    [`${field}No`]: ((context) => context[field] === "no") as Guard,
  };
}

const geldspanneAbove5k: Guard = (context) =>
  context.geldspanne === "above_5000";
const geldspanneBelow5k: Guard = (context) =>
  context.geldspanne !== "above_5000";
const geldspanneWithoutClaim: Guard = (context) => context.geldspanne === "no";
const privatpersonEligible = (context: GeldEinklagenVorabcheckContext) =>
  ["yes", "nonSingle", "representing"].includes(context.privatperson ?? "");
const yesNoGuardsFlug = yesNoGuards("flug");

export const guards = {
  ...yesNoGuards("kontaktaufnahme"),
  ...yesNoGuards("fristAbgelaufen"),
  fristAbgelaufenNotSet: (context: GeldEinklagenVorabcheckContext) =>
    context.fristAbgelaufen === "notSet",
  privatpersonNotEligible: (context: GeldEinklagenVorabcheckContext) =>
    ["nonPrivate", "organisation"].includes(context.privatperson ?? ""),
  privatpersonEligibleAndFlugYes: (context: GeldEinklagenVorabcheckContext) =>
    privatpersonEligible(context) && yesNoGuardsFlug.flugYes(context),
  privatpersonEligible,
  forderungOnlyMoney: (context: GeldEinklagenVorabcheckContext) =>
    context.forderung === "money",
  forderungNotOnlyMoney: (context: GeldEinklagenVorabcheckContext) =>
    Boolean(context.forderung && context.forderung !== "money"),
  bereichFamily: (context: GeldEinklagenVorabcheckContext) =>
    context.bereich === "family",
  bereichWork: (context: GeldEinklagenVorabcheckContext) =>
    context.bereich === "work",
  bereichTravel: (context: GeldEinklagenVorabcheckContext) =>
    context.bereich === "travel",
  bereichLiving: (context: GeldEinklagenVorabcheckContext) =>
    context.bereich === "living",
  bereichTax: (context: GeldEinklagenVorabcheckContext) =>
    context.bereich === "tax",
  bereichFilled: (context: GeldEinklagenVorabcheckContext) => !!context.bereich,
  ...yesNoGuardsFlug,
  ...yesNoGuards("gegenseitePersonDeutschland"),
  ...yesNoGuards("gegenseiteUnternehmenDeutschland"),
  ...yesNoGuards("bundIdAccount"),
  ...yesNoGuards("wohnraeume"),
  bundIdAccountWantTo: (context: GeldEinklagenVorabcheckContext) =>
    context.bundIdAccount === "wantTo",
  gegenseiteMultiple: (context: GeldEinklagenVorabcheckContext) =>
    context.gegenseite === "multiple",
  gegenseitePrivatperson: (context: GeldEinklagenVorabcheckContext) =>
    context.gegenseite === "privatperson",
  gegenseiteUnternehmen: (context: GeldEinklagenVorabcheckContext) =>
    context.gegenseite === "unternehmen",
  geldspanneBelow5k,
  geldspanneAbove5k,
  geldspanneWithoutClaim,
  gegenseiteUnternehmenPlzPartnerCourt: (
    context: GeldEinklagenVorabcheckContext,
  ) => isPartnerCourt(context.gegenseiteUnternehmenPlz),
  gegenseitePersonPlzPartnerCourt: (context: GeldEinklagenVorabcheckContext) =>
    isPartnerCourt(context.gegenseitePersonPlz),
  schadenPlzPartnerCourt: (context: GeldEinklagenVorabcheckContext) =>
    isPartnerCourt(context.schadenPlz),
  ortLeistungPlzPartnerCourt: (context: GeldEinklagenVorabcheckContext) =>
    isPartnerCourt(context.ortLeistungPlz),
  wohnraumPlzPartnerCourt: (context: GeldEinklagenVorabcheckContext) =>
    isPartnerCourt(context.wohnraumPlz),
  wasUnerlaubteHandlung: (context: GeldEinklagenVorabcheckContext) =>
    context.bereich === "violation",
};
