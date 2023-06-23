import type { GeldEinklagenVorabcheckContext } from "./pages";

type GeldEinklagenVorabcheckGuard = (
  context: GeldEinklagenVorabcheckContext
) => boolean;

function yesNoGuards<Field extends keyof GeldEinklagenVorabcheckContext>(
  field: Field
): {
  [field in Field as `${field}Yes`]: GeldEinklagenVorabcheckGuard;
} & {
  [field in Field as `${field}No`]: GeldEinklagenVorabcheckGuard;
} {
  //@ts-ignore
  return {
    [`${field}Yes`]: ((context) =>
      context[field] === "yes") as GeldEinklagenVorabcheckGuard,
    [`${field}No`]: ((context) =>
      context?.[field] === "no") as GeldEinklagenVorabcheckGuard,
  };
}

export const guards = {
  ...yesNoGuards("kontaktaufnahme"),
  ...yesNoGuards("fristAbgelaufen"),
  fristAbgelaufenNotSet: (context: GeldEinklagenVorabcheckContext) =>
    context.fristAbgelaufen === "notSet",
  ...yesNoGuards("verjaehrt"),
  ...yesNoGuards("beweise"),
  ...yesNoGuards("gerichtsentscheidung"),
  ...yesNoGuards("verfahrenBegonnen"),
  ...yesNoGuards("privatperson"),
  notSinglePerson: (context: GeldEinklagenVorabcheckContext) =>
    context.privatperson !== "yes",
  ...yesNoGuards("wohnsitzDeutschland"),
};
