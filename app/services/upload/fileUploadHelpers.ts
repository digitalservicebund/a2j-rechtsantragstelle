import { useLoaderData, useSubmit } from "react-router";
import { type loader } from "~/routes/shared/formular.server";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

export const splitFieldName = (fieldName: string) => ({
  fieldName: fieldName.split("[")[0],
  inputIndex: Number(
    RegExp(/\[\d+\]/)
      .exec(fieldName)?.[0]
      .replaceAll(/[[\]]/g, ""),
  ),
});

export function useFileHandler() {
  const { csrf } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  return {
    onFileUpload: async (fieldName: string, file: File | undefined) => {
      const formData = new FormData();
      formData.append("_action", `fileUpload.${fieldName}`);
      formData.append(CSRFKey, csrf);
      formData.append(fieldName, file ?? "");
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
