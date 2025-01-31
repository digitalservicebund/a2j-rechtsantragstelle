import CheckIcon from "@digitalservicebund/icons/Check";
import DeleteOutline from "@digitalservicebund/icons/DeleteOutline";
import classNames from "classnames";
import { useState } from "react";
import Button from "~/components/Button";
import { ErrorMessageProps } from "..";

//   Styling observations:
//   - Having a custom label attached to the input so I could style it as in the design.
//   - The input is visually hidden but not hidden from the DOM, so the element can still be there and be accessed.
//   - I used a span inside a label because I can not give a role to the label and I think it will be not keyboard accessible.
//   - I am not sure about using tabIndex on the span.
//   - Using accept=".pdf, .tiff" to restrict the file types that can be uploaded. Is this accessible?

export type FileUploadInputProps = {
  name: string;
  label?: string;
  errorMessages?: ErrorMessageProps[];
  isDisabled: boolean;
};

// eslint-disable-next-line no-empty-pattern
const FileUploadInput = ({}: FileUploadInputProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUploadInProgress, setFileUploadInProgress] =
    useState<boolean>(false);
  const [fileUploadDone, setFileUploadDone] = useState<boolean>(false);

  const DateiClassNames = classNames(
    "w-full h-64 bg-gray-100 border-2 border-gray-600 flex justify-between items-center text-gray-900 font-400 text-base p-8",
    {
      "bg-green-100 border-2 border-green-700": fileUploadDone,
    },
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target?.files?.[0];
    if (uploadedFile) {
      setTimeout(() => setFileUploadInProgress(true), 1000);
      setTimeout(() => setFile(uploadedFile), 2000);
      setTimeout(() => setFileUploadDone(true), 3000);
      setTimeout(() => setFileUploadInProgress(false), 3000);
    }
  };

  return (
    <div className="w-full h-auto">
      {!file && (
        <div className="w-full h-auto mb-8 mt-8">
          <label
            htmlFor="fileUpload"
            className="bg-white font-bold text-lg text-blue-800 border-2 border-blue-800 p-10 cursor-pointer focus:outline"
          >
            <span role="button" tabIndex={0}>
              Datei auswählen
            </span>
          </label>
          <input
            type="file"
            id="fileUpload"
            aria-invalid="true"
            accept=".pdf, .tiff"
            onChange={handleFileChange}
            className="w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0"
          />
        </div>
      )}
      <div className="w-full h-auto mb-8 mt-8">
        {file && (
          <div className="w-auto h-auto mb-8 mt-8">
            <p className="text-gray-900 text-m">Datei</p>
            <div className={DateiClassNames}>
              {file.name}
              {fileUploadInProgress && "wird hochgeladen..."}
              {fileUploadDone && (
                <CheckIcon className="shrink-0 fill-green-700" />
              )}
            </div>
          </div>
        )}
      </div>
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
    </div>
  );
};

export default FileUploadInput;
