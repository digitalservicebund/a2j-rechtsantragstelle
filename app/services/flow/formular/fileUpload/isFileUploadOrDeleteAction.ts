export const isFileUploadOrDeleteAction = (
  formAction: FormDataEntryValue | null,
): formAction is string => {
  return (
    typeof formAction === "string" &&
    (formAction.startsWith("fileUpload") || formAction.startsWith("deleteFile"))
  );
};
