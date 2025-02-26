import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import InsertFileIcon from "@digitalservicebund/icons/InsertDriveFile";
import { convertFileSize } from "./convertFileSize";
import Button from "../Button";

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
        <InsertFileIcon className="shrink-0 fill-gray-900" />
        <p className="text-base text-black font-400 mr-8 ml-10 truncate">
          {fileName}
        </p>
        <p className="text-base text-gray-900 font-400">
          {convertFileSize(fileSize ?? 0)}
        </p>
      </div>
      <Button
        iconLeft={<DeleteIcon className="shrink-0" />}
        look="ghost"
        text={deleteButtonLabel}
        type="submit"
      />
    </div>
  );
};
