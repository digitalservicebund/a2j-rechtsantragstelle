import { type FC } from "react";
import Button from "../Button";

export type FilesUploadInputProps = {
  fieldName: string;
  selectFilesButtonLabel: string;
};

export const FilesUploadInput: FC<FilesUploadInputProps> = ({
  fieldName,
  selectFilesButtonLabel,
}) => {
  return (
    <div className="w-full my-14">
      <label>
        <input
          data-testid="filesUpload"
          type="file"
          name={fieldName}
          accept=".pdf, .tiff, .tif"
          className="w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer"
        />
        <Button look="tertiary" text={selectFilesButtonLabel} />
      </label>
    </div>
  );
};
