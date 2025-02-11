import { type FC } from "react";
import Button from "../Button";
import { ErrorMessageProps } from "../inputs";

export type FilesUploadInputProps = {
  formId?: string;
  inputName: string;
  inputType?: string;
  helperText?: string;
  selectFilesButtonLabel?: string;
  errorMessages?: ErrorMessageProps[]
  onFileSelect: (file: File) => void;
};

export const FilesUploadInput: FC<FilesUploadInputProps & {innerRef? : React.Ref<HTMLInputElement>}> = ({
  inputName,
  selectFilesButtonLabel,
  onFileSelect,
}) => {

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      onFileSelect(files[0]);
    }
  }
  return (
    <div className="w-full my-14">
      <label>
        <input
          type="file"
          name={inputName}
          data-testid="filesUploadInput"
          accept=".pdf, .tiff, .tif"
          className="w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer"
          onChange={handleFileSelect}
        />
        <Button look="tertiary" text={selectFilesButtonLabel} />
      </label>
  
    </div>
  );
};
