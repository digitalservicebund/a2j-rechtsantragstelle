import Button from "../Button";

export type FileInputsNoJSProps = {
  name: string;
  submitButtonLabel?: string;
};

export const FileInputsNoJS = ({
  name,
  submitButtonLabel,
}: FileInputsNoJSProps) => {
  const maxNumberOfFiles = 5;
  return (
    <div className="ds-input-group flex-col">
      {Array.from({ length: maxNumberOfFiles }, (_, index) => (
        <label key={index} htmlFor={name} className="p-8">
          <input
            type="file"
            accept=".pdf, .tiff, .tif"
            data-testid="fileUploadInput"
            className="w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer"
          />
          <Button look="tertiary" text={submitButtonLabel} type="submit" />
        </label>
      ))}
    </div>
  );
};
