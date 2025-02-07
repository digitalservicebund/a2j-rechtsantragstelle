import CloseIcon from "@digitalservicebund/icons/Close";
import DeleteOutline from "@digitalservicebund/icons/DeleteOutline";
import InsertDriveFileIcon from "@digitalservicebund/icons/InsertDriveFile";
import classNames from "classnames";
import { FC } from "react";
import {
  stateIsInProgress,
  stateIsDone,
  FilesUploadState,
} from "~/services/filesUploadState/filesUploadState";
import Button from "../Button";
import { FileUploadSpinner } from "./FilesUploadSpinner";

export type FilesUploadStatusProps = {
  fileName?: string;
  fileSize?: number;
  state: FilesUploadState;
  cancelButtonLabel?: string;
  deleteButtonLabel?: string;
  uploadProgressLabel?: string;
};

export const FilesUploadStatus: FC<FilesUploadStatusProps> = ({
  state,
  fileName,
  fileSize,
  cancelButtonLabel,
  deleteButtonLabel,
  uploadProgressLabel,
}) => {
  const filesDisplayClassNames = classNames(
    "w-full h-64 bg-gray-100 flex justify-between items-center px-16 my-14",
  );

  const filesContainer = classNames("w-full max-w-xl flex");
  const fileNameClassNames = classNames(
    "w-full max-w-md text-base text-black font-400 mr-8 overflow-hidden whitespace-nowrap text-ellipsis",
  );
  const filesInfo = classNames(
    "w-full max-w-24 text-base text-gray-900 font-400",
  );
  const getFileUploadDisplay = (): JSX.Element | null => {
    // Turn into component? Better to test?
    const oneMegaByteInBytes = 1024 * 1024;
    const fileBytesToMegabytes = `${((fileSize ?? 0) / oneMegaByteInBytes).toLocaleString("de-DE", { maximumFractionDigits: 1 })} MB`;

    switch (true) {
      case stateIsInProgress(state):
        return (
          <div className={filesDisplayClassNames}>
            <FileUploadSpinner />
            <div className={filesContainer}>
              <p className={fileNameClassNames}>{fileName}</p>
              <p className={filesInfo}> {uploadProgressLabel}</p>
            </div>
            <Button
              iconLeft={<CloseIcon className="shrink-0" />}
              look="ghost"
              text={cancelButtonLabel}
            />
          </div>
        );
      case stateIsDone(state):
        return (
          <div className={filesDisplayClassNames}>
            <div className={filesContainer}>
              <InsertDriveFileIcon className="shrink-0 fill-gray-900 mr-10" />
              <p className={fileNameClassNames}>{fileName}</p>
              <p className={filesInfo}>{fileBytesToMegabytes}</p>
            </div>
            <Button
              iconLeft={<DeleteOutline className="shrink-0" />}
              look="ghost"
              text={deleteButtonLabel}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return <>{getFileUploadDisplay()}</>;
};
