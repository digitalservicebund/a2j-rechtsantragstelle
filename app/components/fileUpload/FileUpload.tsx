import { useState } from "react";
import { FileUploadState } from "~/services/fileUploadState/fileUploadState";
import { FileUploadButton } from "./FileUploadButton";
import { FileUploadError, FileUploadErrorType } from "./FileUploadError";
import { FileUploadStatus } from "./FileUploadStatus";

//   Styling observations:
//   - Having a custom label attached to the input so I could style it as in the design.
//   - The input is visually hidden but not hidden from the DOM, so the element can still be there and be accessed.
//   - Using accept=".pdf, .tiff" to restrict the file types that can be uploaded. Is this accessible?

export type FileUploadProps = {
  label?: string;
  // title: string;
  // description?: string;
};

type UploadError = {
  file: File;
  message: FileUploadErrorType;
};

export const FileUpload = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [errors, setErrors] = useState<UploadError[]>([]);

  function validateAndSetFiles(files: FileList | null) {
    setFiles(files);
    const newErrors: UploadError[] = [];
    if (files !== null) {
      for (const file of files) {
        const fileLimitMegabytes = 100;
        const fileBytesToMegabytes = file.size / 1024 / 1024;

        if (
          file.type !== "application/pdf" &&
          file.type !== "image/tiff" &&
          file.type !== "image/tif"
        ) {
          newErrors.push({
            file,
            message: FileUploadErrorType.InvalidFileExtension,
          });
        } else if (fileBytesToMegabytes > fileLimitMegabytes) {
          newErrors.push({
            file,
            message: FileUploadErrorType.InvalidFileSize,
          });
        }
      }
    }
    setErrors(newErrors);
  }
  // Maybe useMemo?
  const filesAsArray = Array.from(files ?? []);

  // Keep already uploaded files, disable the button and show message
  if (filesAsArray.length > 5) {
    return <p>Limit is 5</p>;
  }

  return (
    <div className="w-full bg-white p-16">
      <p className="text-base text-900 font-black">
        Beleg über Ihr Arbeitsverhältnis
      </p>
      <p className="text-base text-gray-800 text-400">
        z.B. Kontoauszüge der letzten 6 Monate und Lohnabrechnung
      </p>
      {filesAsArray.map((file) => (
        // use a unique key
        <FileUploadStatus
          key={file.name}
          file={file}
          state={FileUploadState.InProgress}
        />
      ))}

      <FileUploadButton files={files} setFiles={validateAndSetFiles} />

      {errors.map((error) => (
        <FileUploadError
          // use a unique key
          key={error.file.name}
          errorMessage={error.message}
        />
      ))}
    </div>
  );
};
