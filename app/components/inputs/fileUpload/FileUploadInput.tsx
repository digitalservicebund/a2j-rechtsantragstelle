import CheckIcon from "@digitalservicebund/icons/Check";
import DeleteOutline from "@digitalservicebund/icons/DeleteOutline";
import ErrorOutline from "@digitalservicebund/icons/ErrorOutline";
import Add from "@digitalservicebund/icons/Add";
import classNames from "classnames";
import { useState } from "react";
import Button from "~/components/Button";

//   Styling observations:
//   - Having a custom label attached to the input so I could style it as in the design.
//   - The input is visually hidden but not hidden from the DOM, so the element can still be there and be accessed.
//   - I used a span inside a label because I can not give a role to the label and I think it will be not keyboard accessible.
//   - I am not sure about using tabIndex on the span.
//   - Using accept=".pdf, .tiff" to restrict the file types that can be uploaded. Is this accessible?

//  Feature needs to clarify:
//  - Should I already implement a form?
//  - If yes, I need also to implement a page

export type FileUploadInputProps = {
  name: string;
  label?: string;
  isDisabled: boolean;
};

// eslint-disable-next-line no-empty-pattern
const FileUploadInput = ({}: FileUploadInputProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUploadInProgress, setFileUploadInProgress] =
    useState<boolean>(false);
  const [fileUploadDone, setFileUploadDone] = useState<boolean>(false);

  const DateiClassNames = classNames(
    "w-full h-64 bg-gray-100 border-2 border-gray-600 flex justify-between items-center text-gray-900 font-400 text-base px-16",
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

  const fileType = file?.type;
  const fileMegabytes = 100;
  const fileBytesToMegabytes = (file?.size ?? 0) / 1024 / 1024;

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

          {/* This block makes sense just when we have a form and a submit button */}

          {/* {!file && (
            <div className="flex items-center mt-16">
              <ErrorOutline className="shrink-0 fill-red-900 mr-10" />{" "}
              <p className="text-red-900 text-base">
                Bitte wählen Sie eine Datei aus.
              </p>
            </div>
          )} */}
        </div>
      )}
      <div className="w-full h-auto mb-8 mt-8">
        {file && (
          <div className="w-auto h-auto">
            <p className="text-gray-900 text-m">Datei</p>
            <div className={DateiClassNames}>
              {file.name}
              {/* Need to discuss about the loader and accessibility here */}
              {fileUploadInProgress && "wird hochgeladen..."}
              {fileUploadDone && (
                <CheckIcon className="shrink-0 fill-green-700" />
              )}
            </div>
            {/* The validation errors should be displayed in the form level? */}
            {/* Do this validation error (Bitte laden Sie nur PDF– oder TIF–Dateien hoch) makes sense? */}
            {/* I added a native attribute to the input. It makes the input accept just files in the specific format*/}
            {/* I think the validation errors should be displayed separated addressing one issue at the time (One for the file type an one for the file size) */}
            {fileType !== "application/pdf" &&
              fileType !== "application/tiff" && (
                <div className="flex items-center mt-16">
                  <ErrorOutline className="shrink-0 fill-red-900 mr-10" />{" "}
                  <p className="text-red-900 text-base">
                    Bitte laden Sie nur PDF– oder TIF–Dateien hoch.
                  </p>
                </div>
              )}
            {fileBytesToMegabytes > fileMegabytes && (
              <div className="flex items-center mt-16">
                <ErrorOutline className="shrink-0 fill-red-900 mr-10" />{" "}
                <p className="text-red-900 text-base">
                  Bitte laden Sie nur Dateien mit einer maximalen Größe von
                  jeweils 100 MB hoch.
                </p>
              </div>
            )}
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

export default FileUploadInput;
