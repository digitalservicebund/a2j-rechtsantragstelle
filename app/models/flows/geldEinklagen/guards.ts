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

export const guards = {
  ...yesNoGuards("kontaktaufnahme"),
  ...yesNoGuards("fristAbgelaufen"),
  fristAbgelaufenNotSet: (context: GeldEinklagenVorabcheckContext) =>
    context.fristAbgelaufen === "notSet",
  privatpersonEligible: (context: GeldEinklagenVorabcheckContext) =>
    ["yes", "nonSingle", "representing"].includes(context.privatperson ?? ""),
  privatpersonNotEligible: (context: GeldEinklagenVorabcheckContext) =>
    ["nonPrivate", "organisation"].includes(context.privatperson ?? ""),
  forderungOnlyMoney: (context: GeldEinklagenVorabcheckContext) =>
    context.forderung === "money",
  forderungNotOnlyMoney: (context: GeldEinklagenVorabcheckContext) =>
    Boolean(context.forderung && context.forderung !== "money"),
  bereichFamily: (context: GeldEinklagenVorabcheckContext) =>
    context.bereich == "family",
  bereichWork: (context: GeldEinklagenVorabcheckContext) =>
    context.bereich == "work",
  bereichTravel: (context: GeldEinklagenVorabcheckContext) =>
    context.bereich == "travel",
  bereichLiving: (context: GeldEinklagenVorabcheckContext) =>
    context.bereich == "living",
  bereichTax: (context: GeldEinklagenVorabcheckContext) =>
    context.bereich == "tax",
  bereichFilled: (context: GeldEinklagenVorabcheckContext) => !!context.bereich,
  ...yesNoGuards("flug"),
  ...yesNoGuards("bundIdAccount"),
  ...yesNoGuards("wohnraeume"),
  bundIdAccountWantTo: (context: GeldEinklagenVorabcheckContext) =>
    context.bundIdAccount === "wantTo",
  gegenseiteMultiple: (context: GeldEinklagenVorabcheckContext) =>
    context.gegenseite == "multiple",
  gegenseiteStaat: (context: GeldEinklagenVorabcheckContext) =>
    context.gegenseite == "staat",
  gegenseitePrivatperson: (context: GeldEinklagenVorabcheckContext) =>
    context.gegenseite == "privatperson",
  gegenseiteUnternehmen: (context: GeldEinklagenVorabcheckContext) =>
    context.gegenseite == "unternehmen",
  geldspanneBelow5k,
  geldspanneAbove5k,
  geldspanneWithoutClaim,
};
