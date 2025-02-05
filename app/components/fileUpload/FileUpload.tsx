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
        newErrors.push({
          file,
          message: FileUploadErrorType.InvalidFileExtension,
        });
      }
    }
    setErrors(newErrors);
  }
  // Maybe useMemo?
  const filesAsArray = Array.from(files ?? []);

  return (
    <div className="w-full h-auto">
      {filesAsArray.map((file) => (
        // use a unique key
        <div className="w-auto h-auto" key={file.name}>
          <FileUploadStatus file={file} state={FileUploadState.NotStarted} />
        </div>
      ))}
      <FileUploadButton files={files} setFiles={validateAndSetFiles} />

      {errors.map((error) => (
        <FileUploadError
          // use a unique key
          key={error.file.name}
          file={error.file}
          errorMessage={error.message}
        />
      ))}
      {/* {file && (
        <div className="w-full h-auto mb-8 mt-8">
          <Button
            look="tertiary"
            iconLeft={<DeleteOutline className="w-6 h-6" />}
            aria-label="delete uploaded file"
            text="Entfernen"
            onClick={() => setFile(null)}
          />
        </div>
      )} */}
    </div>
  );
};
