import { useId, type FC } from "react";
import Button from "../Button";

export type FilesUploadInputProps = {
  selectFilesButtonLabel?: string;
};

export const FilesUploadInput: FC<FilesUploadInputProps> = ({
  selectFilesButtonLabel,
}) => {
  const inputId = useId();

  return (
    <div className="w-full">
      <label htmlFor="filesUpload">
        <input
          data-testid="filesUpload"
          multiple
          type="file"
          id={inputId}
          name="filesUpload"
          aria-invalid="true"
          accept=".pdf, .tiff, .tif"
          onChange={() => null}
          className="w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer"
        />
        <Button look="tertiary" text={selectFilesButtonLabel} />
      </label>
    </div>
  );
};
