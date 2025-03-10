import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import InsertFileIcon from "@digitalservicebund/icons/InsertDriveFile";
import classNames from "classnames";
import Button from "../Button";
import { bytesToMegabytesString } from "./bytesToMegabytesString";

type FileUploadInfoProps = {
  inputName: string;
  jsAvailable: boolean;
  onFileDelete: (fieldName: string) => void;
  fileName?: string;
  fileSize?: number;
  deleteButtonLabel?: string;
  hasError?: boolean;
};

export const FileUploadInfo = ({
  inputName,
  jsAvailable,
  onFileDelete,
  fileName,
  fileSize,
  deleteButtonLabel,
  hasError,
}: FileUploadInfoProps) => {
  const classes = classNames(
    "w-full md:h-64 flex flex-col md:flex-row justify-between items-start md:items-center py-16 md:py-0 px-16 my-14",
    {
      "bg-gray-100": !hasError,
      "bg-red-200 border border-red-900": hasError,
    },
  );

  return (
    <div className={classes}>
      <div className="max-w-full flex justify-between items-center">
        <InsertFileIcon className="shrink-0 fill-gray-900" aria-hidden="true" />
        <p className="ds-body-01-reg text-black mr-8 ml-10 truncate">
          {fileName}
        </p>
        <p className="ds-body-01-reg text-gray-900">
          {bytesToMegabytesString(fileSize ?? 0)}
        </p>
      </div>
      <Button
        iconLeft={<DeleteIcon className="" aria-hidden="true" />}
        look="ghost"
        onClick={() => onFileDelete(inputName)}
        className="pl-0 md:pl-12"
        text={deleteButtonLabel}
        name="_action"
        value={`deleteFile.${inputName}`}
        type={jsAvailable ? "button" : "submit"}
      />
    </div>
  );
};
