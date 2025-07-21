import { useLoaderData, useSubmit } from "react-router";
import { type loader } from "~/routes/shared/formular";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

export function useFileHandler() {
  const { csrf } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  return {
    onFileUpload: async (fieldName: string, file: File | undefined) => {
      if (typeof file === "undefined") {
        return;
      }

      const formData = new FormData();
      formData.append("_action", `fileUpload.${fieldName}`);
      formData.append(CSRFKey, csrf);
      formData.append(fieldName, file);
      await submit(formData, {
        method: "post",
        encType: "multipart/form-data",
      });
    },
    onFileDelete: async (fieldName: string) => {
      const formData = new FormData();
      formData.append("_action", `deleteFile.${fieldName}`);
      formData.append(CSRFKey, csrf);
      await submit(formData, {
        method: "post",
        encType: "multipart/form-data",
      });
    },
  };
}
