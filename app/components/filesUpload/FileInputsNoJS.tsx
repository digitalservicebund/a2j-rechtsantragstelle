import Button from "../Button";

export type FileInputsNoJSProps = {
  name: string;
  buttonText: string;
};

export const FileInputsNoJS = ({ name }: FileInputsNoJSProps) => {
  return (
    <div className="ds-input-group flex-col">
      {Array.from({ length: 5 }, (_, index) => (
        <label key={index} htmlFor={name} className="p-8">
          <input
            type="file"
            accept=".pdf, .tiff, .tif"
            data-testid="fileUploadInput"
            className="w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer"
          />
          <Button look="tertiary" text={"Select Files"} type="submit" />
        </label>
      ))}
    </div>
  );
};
