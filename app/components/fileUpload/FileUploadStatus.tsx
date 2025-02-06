import CloseIcon from "@digitalservicebund/icons/Close";
import DeleteOutline from "@digitalservicebund/icons/DeleteOutline";
import InsertDriveFileIcon from "@digitalservicebund/icons/InsertDriveFile";
import classNames from "classnames";
import {
  stateIsInProgress,
  stateIsDone,
  FileUploadState,
} from "~/services/fileUploadState/fileUploadState";
import Button from "../Button";
import { FileUploadSpinner } from "./FileUploadSpinner";

export type FileUploadStatusProps = {
  file: File;
  state: FileUploadState;
};

export const FileUploadStatus = ({ state, file }: FileUploadStatusProps) => {
  const fileDisplayClassNames = classNames(
    "w-full h-64 bg-gray-100 flex justify-between items-center px-16 my-14",
  );

  const fileContainer = classNames("w-full max-w-xl flex");
  const fileNameClassNames = classNames(
    "w-full max-w-md text-base text-black font-400 mr-8 overflow-hidden whitespace-nowrap text-ellipsis",
  );
  const fileInfo = classNames(
    "w-full max-w-24 text-base text-gray-900 font-400",
  );
  const getFileUploadDisplay = (file: File | null): JSX.Element | null => {
    // Turn into component?
    const fileBytesToMegabytes = `${((file?.size ?? 0) / 1024 / 1024).toLocaleString("de-DE", { maximumFractionDigits: 1 })} MB`;

    switch (true) {
      case stateIsInProgress(state):
        return (
          <div className={fileDisplayClassNames}>
            <FileUploadSpinner />
            <div className={fileContainer}>
              <p className={fileNameClassNames}>{file?.name}</p>
              <p className={fileInfo}> {"wird hochgeladen"}</p>
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
          <div className={fileDisplayClassNames}>
            <div className={fileContainer}>
              <InsertDriveFileIcon className="shrink-0 fill-gray-900 mr-10" />
              <p className={fileNameClassNames}>{file?.name}</p>
              <p className={fileInfo}>{fileBytesToMegabytes}</p>
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
