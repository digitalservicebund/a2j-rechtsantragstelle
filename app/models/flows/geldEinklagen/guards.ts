import type { GeldEinklagenVorabcheckContext } from "./pages";

type Guard = (context: GeldEinklagenVorabcheckContext) => boolean;

function yesNoGuards<Field extends keyof GeldEinklagenVorabcheckContext>(
  field: Field
): { [field in Field as `${field}Yes`]: Guard } & {
  [field in Field as `${field}No`]: Guard;
} {
  //@ts-ignore
  return {
    [`${field}Yes`]: ((context) => context[field] === "yes") as Guard,
    [`${field}No`]: ((context) => context?.[field] === "no") as Guard,
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
