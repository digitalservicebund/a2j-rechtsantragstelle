export type GeldEinklagenVorabcheckContext = Record<string, any>;

type GeldEinklagenVorabcheckGuard = (
  context: GeldEinklagenVorabcheckContext
) => boolean;

const yesNoGuards = (
  step: string,
  field?: string
): Record<string, GeldEinklagenVorabcheckGuard> => ({
  [`${step}Yes`]: (context) => context?.[step]?.[field ?? step] === "yes",
  [`${step}No`]: (context) => context?.[step]?.[field ?? step] === "no",
});

export const guards = {
  ...yesNoGuards("kontaktaufnahme", "kontaktaufnahme"),
};
