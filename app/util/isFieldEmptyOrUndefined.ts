export const isFieldEmptyOrUndefined = (field: string | undefined) => {
  return field === "" || typeof field == "undefined";
};
