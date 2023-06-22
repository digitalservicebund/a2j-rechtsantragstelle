export type GeldEinklagenVorabcheckContext = Record<
  string,
  Record<string, string>
>;

type GeldEinklagenVorabcheckGuard = (
  context: GeldEinklagenVorabcheckContext
) => boolean;

function yesNoGuards<Step extends string>(
  step: Step,
  field?: string
): {
  [step in Step as `${step}Yes`]: GeldEinklagenVorabcheckGuard;
} & {
  [step in Step as `${step}No`]: GeldEinklagenVorabcheckGuard;
} {
  //@ts-ignore
  return {
    [`${step}Yes`]: ((context) =>
      context?.[step]?.[field ?? step] ===
      "yes") as GeldEinklagenVorabcheckGuard,
    [`${step}No`]: ((context) =>
      context?.[step]?.[field ?? step] ===
      "no") as GeldEinklagenVorabcheckGuard,
  };
}

export const guards = {
  ...yesNoGuards("kontaktaufnahme"),
  ...yesNoGuards("fristAbgelaufen"),
  fristAbgelaufenNotSet: (context: GeldEinklagenVorabcheckContext) =>
    context?.fristAbgelaufen?.fristAbgelaufen === "notSet",
  ...yesNoGuards("verjaehrt"),
  ...yesNoGuards("beweise"),
};
