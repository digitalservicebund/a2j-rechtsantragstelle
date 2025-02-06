import Add from "@digitalservicebund/icons/Add";
import { type FC } from "react";
import Button from "../Button";

type FilesUploadButtonProps = {
  files: File[];
  setFiles: (files: File[]) => unknown;
};

export const FilesUploadButton: FC<FilesUploadButtonProps> = ({
  files,
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

  return (
    <>
      {files.length === 0 ? (
        <div className="w-full">
          <label htmlFor="filesUpload">
            <input
              data-testid="filesUpload"
              multiple
              type="file"
              // id needs to be added as parameter so the browser can understand which element that is
              id="filesUpload"
              name="filesUpload"
              aria-invalid="true"
              accept=".pdf, .tiff, .tif"
              onChange={handleFileChange}
              className="w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer"
            />
            <Button look="tertiary" text="Datei auswählen" />
          </label>
        </div>
      ) : (
        <Button
          look="tertiary"
          iconLeft={<Add className="w-6 h-6" />}
          text="Weitere Dokumente hinzufügen"
        />
      )}
    </>
  );
};
