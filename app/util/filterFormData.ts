export const filterFormData = (formData: FormData) =>
  // Note: fromEntries() reduces same-named form fields to the last one
  Object.fromEntries(
    Array.from(formData.entries()).filter(([key]) => !key.startsWith("_")),
  );
