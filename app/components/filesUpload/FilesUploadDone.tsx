import AddIcon from "@digitalservicebund/icons/Add";
import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import InsertFileIcon from "@digitalservicebund/icons/InsertDriveFile";
import { FC } from "react";
import { convertFileSize } from "~/components/filesUpload/convertFileSize";
import Button from "../Button";

export type FilesUploadDoneProps = {
  fileNames: string[];
  fileSizes: number[];
  deleteButtonLabel: string;
  selectMoreFilesButtonLabel: string;
};

export const FilesUploadDone: FC<FilesUploadDoneProps> = ({
  fileNames,
  fileSizes,
  deleteButtonLabel,
  selectMoreFilesButtonLabel,
}) => {
  return (
    <>
      <div className="w-full h-64 bg-gray-100 flex justify-between items-center px-16 my-14">
        <div className="max-w-md flex justify-between">
          <InsertFileIcon className="shrink-0 fill-gray-900" />
          {fileNames?.map((name) => (
            <p
              key={name}
              className="text-base text-black font-400 mr-8 ml-10 truncate"
            >
              {name}
            </p>
          ))}
          <p className="text-base text-gray-900 font-400">
            {convertFileSize(fileSizes)}
          </p>
        </div>
        <Button
          iconLeft={<DeleteIcon className="shrink-0" />}
          look="ghost"
          text={deleteButtonLabel}
        />
      </div>
      <Button
        iconLeft={<AddIcon className="w-6 h-6" />}
        text={selectMoreFilesButtonLabel}
      />
    </>
  );
};
