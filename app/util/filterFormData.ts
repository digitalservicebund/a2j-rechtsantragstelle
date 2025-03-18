import { Context } from "~/domains/contexts";

export const filterFormData = (formData: FormData, context?: Context) =>
  // Note: fromEntries() reduces same-named form fields to the last one
  Object.fromEntries(
    Array.from(formData.entries())
      .filter(([key]) => !key.startsWith("_"))
      .map(([key, val]) => {
        if (typeof val === "object") {
          const arrayName = key.split("[")[0];
          return [arrayName, context?.[arrayName] ?? []];
        }
        return [key, val];
      }),
  );
