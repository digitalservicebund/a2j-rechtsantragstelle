import Add from "@digitalservicebund/icons/Add";
import { useId, type FC } from "react";
import Button from "../Button";

type FilesUploadButtonProps = {
  files: File[];
  selectFilesButtonLabel?: string;
  selectMoreFilesButtonLabel?: string;
  setFiles: (files: File[]) => unknown;
};

export const FilesUploadButton: FC<FilesUploadButtonProps> = ({
  files,
  selectFilesButtonLabel,
  selectMoreFilesButtonLabel,
  setFiles,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) {
      setFiles([]);
    } else {
      const filesAsArray = Array.from(event.target.files);
      setFiles(filesAsArray);
    }
  };

  const inputId = useId();

  return (
    <>
      {files.length === 0 ? (
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
              onChange={handleFileChange}
              className="w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer"
            />
            <Button look="tertiary" text={selectFilesButtonLabel} />
          </label>
        </div>
      ) : (
        <Button
          look="tertiary"
          iconLeft={<Add className="w-6 h-6" />}
          text={selectMoreFilesButtonLabel}
        />
      )}
    </>
  );
};
