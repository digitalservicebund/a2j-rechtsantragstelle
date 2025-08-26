import { useLoaderData, useSubmit } from "react-router";
import { type loader } from "~/routes/shared/formular";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

const options = { method: "post", encType: "multipart/form-data" } as const;
const handleSubmissionError = (error: unknown) =>
  // eslint-disable-next-line no-console
  console.error("An error occurred during form submission:", error);

export function useFileHandler() {
  const { csrf } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  return {
    onFileUpload: (fieldName: string, file: File | undefined) => {
      if (typeof file === "undefined") return;

      const formData = new FormData();
      formData.append("_action", `fileUpload.${fieldName}`);
      formData.append(CSRFKey, csrf);
      formData.append(fieldName, file);
      submit(formData, options).catch(handleSubmissionError);
    },
    onFileDelete: (fieldName: string) => {
      const formData = new FormData();
      formData.append("_action", `deleteFile.${fieldName}`);
      formData.append(CSRFKey, csrf);
      submit(formData, options).catch(handleSubmissionError);
    },
  };
}
