import { useLoaderData, useSubmit } from "@remix-run/react";
import { type loader } from "~/routes/shared/formular.server";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { type PDFFileMetadata } from "~/util/file/pdfFileSchema";

export function convertFileToMetadata(file?: File): PDFFileMetadata {
  return {
    filename: file?.name ?? "",
    fileType: file?.type ?? "",
    fileSize: file?.size ?? 0,
  };
}

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
    onFileUpload: (fieldName: string, file: File | undefined) => {
      const formData = new FormData();
      formData.append("_action", `fileUpload.${fieldName}`);
      formData.append(CSRFKey, csrf);
      formData.append(fieldName, file ?? "");
      submit(formData, {
        method: "post",
        encType: "multipart/form-data",
      });
    },
    onFileDelete: (fieldName: string) => {
      const formData = new FormData();
      formData.append("_action", `deleteFile.${fieldName}`);
      formData.append(CSRFKey, csrf);
      submit(formData, {
        method: "post",
        encType: "multipart/form-data",
      });
    },
  };
}
