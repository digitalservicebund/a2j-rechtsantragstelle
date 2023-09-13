import type { GeldEinklagenVorabcheckContext } from "./flows/geldEinklagen/pages";

export const getGerichtskostenvorschuss = (
  context: GeldEinklagenVorabcheckContext,
): number => {
  if (
    !context.geldspanne ||
    context.geldspanne === "no" ||
    context.geldspanne === "above_5000"
  )
    return 0;

  /* eslint-disable camelcase */
  const gerichtskostenvorschuss = {
    below_500: 114,
    above_500: 174,
    above_1000: 234,
    above_1500: 294,
    above_2000: 357,
    above_3000: 420,
    above_4000: 483,
  };
  /* eslint-enable camelcase */

  return gerichtskostenvorschuss[context.geldspanne];
};
