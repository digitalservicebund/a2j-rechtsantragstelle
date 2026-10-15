// Converts a flow engine stepId to the stepId of its Strapi page: result pages
// drop their "ergebnis/" prefix and array pages drop their "#" wildcards.
export const toCmsStepId = (stepId: string) =>
  stepId.replace("ergebnis/", "").replaceAll("/#", "");
