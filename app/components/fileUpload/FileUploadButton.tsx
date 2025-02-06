import Add from "@digitalservicebund/icons/Add";
import { type FC } from "react";
import Button from "../Button";

type FileUploadButtonProps = {
  files: FileList | null;
  setFiles: (files: FileList | null) => unknown;
};

export const FileUploadButton: FC<FileUploadButtonProps> = ({
  files,
  setFiles,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
  };

  return (
    <>
      {!files ? (
        <div className="w-full">
          <input
            multiple
            type="file"
            // id needs to be added as parameter so the browser can understand which element that is
            id="fileUpload"
            name="fileUpload"
            aria-invalid="true"
            accept=".pdf, .tiff, .tif"
            onChange={handleFileChange}
            className="w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer"
          />
          <label htmlFor="fileUpload">
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
