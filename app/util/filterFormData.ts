export const filterFormData = (formData: FormData) =>
  // Note: fromEntries() reduces same-named form fields to the last one
  Object.fromEntries(
    Array.from(formData.entries())
      .filter(([key, val]) => !key.startsWith("_") && typeof val === "string")
      .map(([key, val]) => {
        if (key === "arrayPostfix") {
          return [val, []];
        }
        return [key, val];
      }),
  );
