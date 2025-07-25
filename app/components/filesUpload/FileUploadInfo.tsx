import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import InsertFileIcon from "@digitalservicebund/icons/InsertDriveFile";
import classNames from "classnames";
import { translations } from "~/services/translations/translations";
import {
  errorStyling,
  type PDFFileMetadata,
} from "~/services/validation/pdfFileSchema";
import { formatFileSizeToString } from "../../services/upload/formatFileSizeToString";
import Button from "../Button";

type FileUploadInfoProps = {
  inputName: string;
  jsAvailable: boolean;
  onFileDelete: (fieldName: string) => void;
  file: PDFFileMetadata;
  hasError?: boolean;
};

export const FileUploadInfo = ({
  inputName,
  jsAvailable,
  onFileDelete,
  file,
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
      <div className="max-w-full grid grid-cols-[24px_1fr_auto] gap-x-12 items-center">
        <InsertFileIcon className="shrink-0 fill-gray-900" aria-hidden="true" />
        <span className="ds-body-01-reg text-black truncate">
          {file.filename}
        </span>
        <span className="text-gray-900 ds-body-02-reg">
          {formatFileSizeToString(file.fileSize)}
        </span>
      </div>
      {!hasError && <HiddenFileInputs inputName={inputName} file={file} />}
      <Button
        iconLeft={<DeleteIcon className="" aria-hidden="true" />}
        look="ghost"
        onClick={() => (jsAvailable ? onFileDelete(inputName) : undefined)}
        className="pl-0 md:pl-12"
        text={translations.fileUpload.delete.de}
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
