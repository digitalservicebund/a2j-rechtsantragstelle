import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import InsertFileIcon from "@digitalservicebund/icons/InsertDriveFile";
import Button from "../Button";
import { bytesToMegabytesString } from "./bytesToMegabytesString";

type FileUploadInfoProps = {
  fileName?: string;
  fileSize?: number;
  deleteButtonLabel?: string;
};

export const FileUploadInfo = ({
  fileName,
  fileSize,
  deleteButtonLabel,
}: FileUploadInfoProps) => {
  return (
    <div className="w-full h-64 bg-gray-100 flex justify-between items-center px-16 my-14">
      <div className="max-w-md flex justify-between">
        <InsertFileIcon className="shrink-0 fill-gray-900" aria-hidden="true" />
        <p className="ds-body-01-reg text-black mr-8 ml-10 truncate">
          {fileName}
        </p>
        <p className="ds-body-01-reg text-gray-900">
          {bytesToMegabytesString(fileSize ?? 0)}
        </p>
      </div>
      <Button
        iconLeft={<DeleteIcon className="shrink-0" aria-hidden="true" />}
        look="ghost"
        text={deleteButtonLabel}
        type="submit"
      />
    </div>
  );
};
