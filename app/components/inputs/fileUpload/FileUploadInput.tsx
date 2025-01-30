import { useState } from "react";
import { ErrorMessageProps } from "..";

export type FileUploadInputProps = {
  name: string;
  label?: string;
  errorMessages?: ErrorMessageProps[];
  isDisabled: boolean;
};

// eslint-disable-next-line no-empty-pattern
const FileUploadInput = ({}: FileUploadInputProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target?.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  //   Styling decisions:
  //   - Having a custom label attached to the input.
  //   - The input is visually hidden but not hidden from the DOM, so the element can still be there and be accessed.
  //   - I used a span inside a label because I can not give a role to the label and I think it will be not keyboard accessible.
  //   - I am not sure about using tabIndex on the span.
  return (
    <>
      <div className="w-auto h-auto">
        <label
          htmlFor="fileUpload"
          className="bg-white font-bold text-lg text-blue-800 border-2 border-blue-800 cursor-pointer p-10"
        >
          <span role="button" tabIndex={0}>
            Datei auswählen
          </span>
        </label>
        <input
          onChange={handleFileChange}
          id="fileUpload"
          className="w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0"
          type="file"
        />
      </div>
      <div className="w-auto h-auto">
        {file && (
          <div className="w-auto h-auto">
            <p className="text-gray-900 text-m">Datei</p>
            <div className="w-530 h-26 bg-gray-100 border-2 border-gray-200">
              <p className="text-black font-400 text-s p-8">{file.name}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FileUploadInput;
