import { type FC } from "react";
import Button from "../Button";
import { ErrorMessageProps } from "../inputs";

export type FileUploadInputProps = {
  inputName: string;
  selectFilesButtonLabel?: string;
  errorMessages?: ErrorMessageProps[];
  onFileSelect: (file: File) => void;
};

export const FileUploadInput: FC<
  FileUploadInputProps & { innerRef?: React.Ref<HTMLInputElement> }
> = ({ inputName, selectFilesButtonLabel, onFileSelect, innerRef }) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      onFileSelect(files[0]);
    }
  };
  return (
    <div className="ds-input-group">
      <label>
        <input
          type="file"
          name={inputName}
          ref={innerRef}
          data-testid="fileUploadInput"
          accept=".pdf, .tiff, .tif"
          className="ds-input w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer"
          onChange={handleFileSelect}
        />
        <Button look="tertiary" text={selectFilesButtonLabel} />
      </label>
    </div>
  );
};
