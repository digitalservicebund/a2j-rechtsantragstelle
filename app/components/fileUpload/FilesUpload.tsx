import { FC, useState } from "react";
import { FilesUploadState } from "~/services/filesUploadState/filesUploadState";
import { FilesUploadButton } from "./FilesUploadButton";
import { FilesUploadError, FilesUploadErrorType } from "./FilesUploadError";
import { FilesUploadStatus } from "./FilesUploadStatus";

export type FilesUploadProps = {
  title?: string;
  description?: string;
};

type UploadError = {
  file: File;
  message: FilesUploadErrorType;
};

export const FilesUpload: FC<FilesUploadProps> = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<UploadError[]>([]);

  function validateAndSetFiles(files: File[]) {
    setFiles(files);
    const newErrors: UploadError[] = [];
    if (files !== null) {
      for (const file of files) {
        const fileLimitMegabytes = 100;
        const oneMegaByteInBytes = 1024 * 1024;
        const fileBytesToMegabytes = file.size / oneMegaByteInBytes;

        if (
          file.type !== "application/pdf" &&
          file.type !== "image/tiff" &&
          file.type !== "image/tif"
        ) {
          newErrors.push({
            file,
            message: FilesUploadErrorType.InvalidFileExtension,
          });
        } else if (fileBytesToMegabytes > fileLimitMegabytes) {
          newErrors.push({
            file,
            message: FilesUploadErrorType.InvalidFileSize,
          });
        }
      }
    }
    setErrors(newErrors);
  }

  return (
    <div className="w-full bg-white p-16">
      <p className="text-base text-900 font-black">
        Beleg über Ihr Arbeitsverhältnis
      </p>
      <p className="text-base text-gray-800 text-400">
        z.B. Kontoauszüge der letzten 6 Monate und Lohnabrechnung
      </p>
      {files.map((file) => (
        // use a unique key
        <FilesUploadStatus
          key={file.name}
          file={file}
          state={FilesUploadState.InProgress}
        />
      ))}

      <FilesUploadButton files={files} setFiles={validateAndSetFiles} />

      {errors.map((error) => (
        <FilesUploadError
          // use a unique key
          key={error.file.name}
          errorMessage={error.message}
        />
      ))}
    </div>
  );
};
