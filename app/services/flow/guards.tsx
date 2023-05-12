function searchEntryInSession(
  context: any,
  stepId: any,
  value: string
): boolean {
  let found = false;
  const values = context[stepId];
  if (values !== undefined) {
    const propertyValues = Object.values(values);
    for (const entry in propertyValues) {
      if (propertyValues[entry] === value) {
        found = true;
        break;
      }
    }
  }

  return found;
}

export default function getGuards(stepId: string, context: any) {
  return {
    yes: () => searchEntryInSession(context, stepId, "yes"),
    no: () => searchEntryInSession(context, stepId, "no"),
    staatlicheLeistung: () => true,
  };
}
