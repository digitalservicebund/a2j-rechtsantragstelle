export const filterFormData = (formData: FormData): FormData => {
  const filteredFormData = new FormData();
  for (const [key, val] of formData.entries()) {
    if (!key.startsWith("_") && typeof val === "string") {
      if (key === "arrayPostfix") {
        filteredFormData.set(val, [].toString());
      } else {
        filteredFormData.set(key, val);
      }
    }
  }
  return filteredFormData;
};
