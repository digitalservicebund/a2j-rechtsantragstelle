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
  file: File;
  state: FilesUploadState;
};

export const FilesUploadStatus: FC<FilesUploadStatusProps> = ({
  state,
  file,
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
  const getFileUploadDisplay = (file: File | null): JSX.Element | null => {
    // Turn into component? Better to test
    const oneMegaByteInBytes = 1024 * 1024;
    const fileBytesToMegabytes = `${((file?.size ?? 0) / oneMegaByteInBytes).toLocaleString("de-DE", { maximumFractionDigits: 1 })} MB`;

    switch (true) {
      case stateIsInProgress(state):
        return (
          <div className={filesDisplayClassNames}>
            <FileUploadSpinner />
            <div className={filesContainer}>
              <p className={fileNameClassNames}>{file?.name}</p>
              <p className={filesInfo}> {"wird hochgeladen..."}</p>
            </div>
            <Button
              iconLeft={<CloseIcon className="shrink-0" />}
              look="ghost"
              text="Abbrechen"
            />
          </div>
        );
      case stateIsDone(state):
        return (
          <div className={filesDisplayClassNames}>
            <div className={filesContainer}>
              <InsertDriveFileIcon className="shrink-0 fill-gray-900 mr-10" />
              <p className={fileNameClassNames}>{file?.name}</p>
              <p className={filesInfo}>{fileBytesToMegabytes}</p>
            </div>
            <Button
              iconLeft={<DeleteOutline className="shrink-0" />}
              look="ghost"
              text="Entfernen"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return <>{getFileUploadDisplay(file)}</>;
};
