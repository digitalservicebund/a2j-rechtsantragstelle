import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import InsertFileIcon from "@digitalservicebund/icons/InsertDriveFile";
import classNames from "classnames";
import { errorStyling, type PDFFileMetadata } from "~/util/file/pdfFileSchema";
import { formatFileSizeToString } from "../../services/upload/formatFileSizeToString";
import Button from "../Button";

type FileUploadInfoProps = {
  inputName: string;
  jsAvailable: boolean;
  onFileDelete: (fieldName: string) => void;
  file: PDFFileMetadata;
  deleteButtonLabel?: string;
  hasError?: boolean;
};

export const FileUploadInfo = ({
  inputName,
  jsAvailable,
  onFileDelete,
  file,
  deleteButtonLabel,
  hasError,
}: FileUploadInfoProps) => {
  const classes = classNames(
    "w-full md:h-64 flex flex-col md:flex-row justify-between items-start md:items-center py-16 md:py-0 px-16",
    {
      "bg-gray-100": !hasError,
      [errorStyling]: hasError,
    },
  );

  return (
    <div className={classes} data-testid={`file-upload-info-${inputName}`}>
      <div className="max-w-full flex justify-between items-center">
        <InsertFileIcon className="shrink-0 fill-gray-900" aria-hidden="true" />
        <p className="ds-body-01-reg text-black mr-8 ml-10 truncate">
          {file.filename}
        </p>
        <p className="ds-body-01-reg text-gray-900">
          {formatFileSizeToString(file.fileSize)}
        </p>
      </div>
      {!hasError && <HiddenFileInputs inputName={inputName} file={file} />}
      <Button
        iconLeft={<DeleteIcon className="" aria-hidden="true" />}
        look="ghost"
        onClick={() => (jsAvailable ? onFileDelete(inputName) : undefined)}
        className="pl-0 md:pl-12"
        text={deleteButtonLabel}
        name="_action"
        value={`deleteFile.${inputName}`}
        type={jsAvailable ? "button" : "submit"}
      />
    </div>
  );
};

const HiddenFileInputs = ({
  inputName,
  file,
}: {
  inputName: string;
  file: PDFFileMetadata;
}) => {
  return (
    <>
      <input
        type="hidden"
        name={`${inputName}.filename`}
        value={file.filename}
      />
      <input
        type="hidden"
        name={`${inputName}.savedFileKey`}
        value={file.savedFileKey}
      />
      <input
        type="hidden"
        name={`${inputName}.fileType`}
        value={file.fileType}
      />
      <input
        type="hidden"
        name={`${inputName}.fileSize`}
        value={file.fileSize}
      />
    </>
  );
};
