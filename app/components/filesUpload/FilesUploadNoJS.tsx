import Button from "../Button";

export type FilesUploadNoJSProps = {
  name: string;
  buttonText: string;
};

export const FilesUploadNoJS = ({ name, buttonText }: FilesUploadNoJSProps) => {
  return (
    <>
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="ds-input-group flex-col">
          <label htmlFor={name}>
            <input
              type="file"
              accept=".pdf, .tiff, .tif"
              data-testid="fileUploadInput"
              className="ds-input w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer"
            />
            <Button look="tertiary" text={buttonText} type="submit" />
          </label>
        </div>
      ))}
    </>
  );
};
