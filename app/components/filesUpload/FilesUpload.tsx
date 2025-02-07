import ErrorOutline from "@digitalservicebund/icons/ErrorOutline";
import { FC, useState } from "react";
import { FilesUploadState } from "~/services/filesUploadState/filesUploadState";
import { FilesUploadButton } from "./FilesUploadButton";
import { FilesUploadStatus } from "./FilesUploadStatus";

export type FilesUploadProps = {
  belegeTitle?: string;
  belegeDescription?: string;
  errorMessage?: string;
};

export const FilesUpload: FC<FilesUploadProps> = ({
  belegeTitle,
  belegeDescription,
  errorMessage,
}) => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="w-full bg-white p-16">
      <p className="text-base text-900 font-black">{belegeTitle}</p>
      <p className="text-base text-gray-800 text-400">{belegeDescription}</p>

      {files.map((file) => (
        // use a unique key
        <FilesUploadStatus
          key={file.name}
          state={FilesUploadState.InProgress}
        />
      ))}

      <FilesUploadButton files={files} setFiles={setFiles} />

      <ErrorOutline className="shrink-0 fill-red-900 mr-10" />
      <p className="text-red-900 text-base">{errorMessage}</p>
    </div>
  );
};
