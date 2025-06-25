export const shouldHandleFileUpload = (
  formAction: FormDataEntryValue | null,
) => {
  return (
    typeof formAction === "string" &&
    (formAction.startsWith("fileUpload") || formAction.startsWith("deleteFile"))
  );
};
