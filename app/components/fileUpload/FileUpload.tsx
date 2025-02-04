import DeleteOutline from "@digitalservicebund/icons/DeleteOutline";
// import Add from "@digitalservicebund/icons/Add";
import { useState } from "react";
import Button from "~/components/Button";
import { FileUploadState } from "~/services/fileUploadState/fileUploadState";
import { FileUploadError, FileUploadErrorType } from "./FileUploadError";
import { FileUploadStatus } from "./FileUploadStatus";

//   Styling observations:
//   - Having a custom label attached to the input so I could style it as in the design.
//   - The input is visually hidden but not hidden from the DOM, so the element can still be there and be accessed.
//   - I used a span inside a label because I can not give a role to the label and I think it will be not keyboard accessible.
//   - I am not sure about using tabIndex on the span.
//   - Using accept=".pdf, .tiff" to restrict the file types that can be uploaded. Is this accessible?

//  Feature needs to clarify:
//  - Should I already implement a form?
//  - If yes, I need also to implement a page

export type FileUploadProps = {
  fileName: string;
  fileExtension: string;
  fileSize: number;
  label?: string;
  isDisabled: boolean;
  state: FileUploadState;
  errorMessage: FileUploadErrorType;
};

export const FileUpload = ({ state, errorMessage }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target?.files?.[0];
    if (uploadedFile) {
      setTimeout(() => setFile(uploadedFile), 2000);
    }
  };

  return (
    <div className="w-full h-auto">
      {!file && (
        <div className="w-full h-auto mb-8 mt-8">
          <input
            type="file"
            id="fileUpload"
            name="fileUpload"
            aria-invalid="true"
            accept=".pdf, .tiff"
            onChange={handleFileChange}
            className="w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer"
          />
          <label htmlFor="fileUpload">
            <Button look="tertiary" text="Datei auswählen" />
          </label>
        </div>
      )}
      {file && (
        <div className="w-auto h-auto">
          <FileUploadStatus file={file} state={state} />
          <FileUploadError
            file={file}
            fileSize={file.size}
            errorMessage={errorMessage}
            fileExtension={file.type}
            state={state}
          />
        </div>
      )}
      {file && (
        <div className="w-full h-auto mb-8 mt-8">
          <Button
            look="tertiary"
            iconLeft={<DeleteOutline className="w-6 h-6" />}
            aria-label="delete uploaded file"
            text="Entfernen"
            onClick={() => setFile(null)}
          />
        </div>
      )}

      {/* Need to add the add more docs button here*/}
      {/* Does this button makes sense? Can I add more than 1 doc to a Beleg? If yes, it is not better to make multiple upload available? */}
      {/* {file && (
        <Button
            look="tertiary"
            iconLeft={<Add className="w-6 h-6" />}
            aria-label="add more documents"
            text="Weitere Dokumente hinzufügen"
            onClick={() => setFile(null)}
        />
      )} */}
    </div>
  );
};
