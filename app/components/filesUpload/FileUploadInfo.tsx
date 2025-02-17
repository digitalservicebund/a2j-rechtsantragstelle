import InsertFileIcon from "@digitalservicebund/icons/InsertDriveFile";
import { FC } from "react";
import { convertFileSize } from "~/components/filesUpload/convertFileSize";

type FileUploadInfoProps = {
  fileName: string;
  fileSize: number;
};

export const FileUploadInfo: FC<FileUploadInfoProps> = ({
  fileName,
  fileSize,
}) => {
  return (
    <div className="max-w-md flex justify-between">
      <InsertFileIcon className="shrink-0 fill-gray-900" />
      <p
        key={fileName}
        className="text-base text-black font-400 mr-8 ml-10 truncate"
      >
        {fileName}
      </p>
      <p className="text-base text-gray-900 font-400">
        {convertFileSize(fileSize)}
      </p>
    </div>
  );
};
