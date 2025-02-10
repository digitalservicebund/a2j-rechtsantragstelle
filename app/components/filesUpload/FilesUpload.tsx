import AddIcon from "@digitalservicebund/icons/Add";
import CloseIcon from "@digitalservicebund/icons/Close";
import DeleteIcon from "@digitalservicebund/icons/DeleteOutline";
import ErrorIcon from "@digitalservicebund/icons/ErrorOutline";
import InsertFileIcon from "@digitalservicebund/icons/InsertDriveFile";
import InfoIcon from "@digitalservicebund/icons/LightbulbOutlined";
import classNames from "classnames";
import { FC } from "react";
import { FilesUploadState } from "~/services/filesUploadState/filesUploadState";
import { FilesUploadInput } from "./FilesUploadInput";
import Button from "../Button";
import { FileUploadSpinner } from "./FilesUploadSpinner";

export type FilesUploadProps = {
  fileNames: string[];
  fileSizes: number[];
  belegTitle?: string;
  warningTitle?: string;
  errorMessage?: string;
  state?: FilesUploadState;
  cancelButtonLabel: string;
  deleteButtonLabel: string;
  belegDescription?: string;
  warningDescription?: string;
  uploadProgressLabel: string;
  selectFilesButtonLabel?: string;
  selectMoreFilesButtonLabel?: string;
};

export const FilesUpload: FC<FilesUploadProps> = ({
  state,
  fileNames,
  fileSizes,
  belegTitle,
  errorMessage,
  warningTitle,
  belegDescription,
  cancelButtonLabel,
  deleteButtonLabel,
  warningDescription,
  uploadProgressLabel,
  selectFilesButtonLabel,
  selectMoreFilesButtonLabel,
}) => {
  const filesDisplayClassNames = classNames(
    "w-full h-64 bg-gray-100 flex justify-between items-center px-16 my-14",
  );
  const filesContainerClassNames = classNames("max-w-md flex");
  const fileNameClassNames = classNames(
    "max-w-fit text-base text-black font-400 mr-8 truncate",
  );
  const filesInfo = classNames(
    "w-full max-w-fit text-base text-gray-900 font-400",
  );

  const oneMegaByteInBytes = 1024 * 1024;
  const totalFileSize = (fileSizes ?? []).reduce((acc, size) => acc + size, 0);
  const fileBytesToMegabytes = `${(totalFileSize / oneMegaByteInBytes).toLocaleString("de-DE", { maximumFractionDigits: 1 })} MB`;

  return (
    <div className="w-full bg-white p-16">
      <p className="text-base text-900 font-black">{belegTitle}</p>
      <p className="text-base text-gray-800 text-400">{belegDescription}</p>

      {(state === FilesUploadState.NotStarted ||
        state === FilesUploadState.Error) && (
        <FilesUploadInput selectFilesButtonLabel={selectFilesButtonLabel} />
      )}

      {state === FilesUploadState.InProgress && (
        <div className={filesDisplayClassNames}>
          <FileUploadSpinner />
          <div className={filesContainerClassNames}>
            {fileNames?.map((name) => (
              <p key={name} className={fileNameClassNames}>
                {name}
              </p>
            ))}
            <p className={filesInfo}> {uploadProgressLabel}</p>
          </div>
          <Button
            iconLeft={<CloseIcon className="shrink-0" />}
            look="ghost"
            text={cancelButtonLabel}
          />
        </div>
      )}

      {state === FilesUploadState.Done && (
        <div className={filesDisplayClassNames}>
          <div className={filesContainerClassNames}>
            <InsertFileIcon className="shrink-0 fill-gray-900 mr-10" />
            {fileNames?.map((name) => (
              <p key={name} className={fileNameClassNames}>
                {name}
              </p>
            ))}
            <p className={filesInfo}>{fileBytesToMegabytes}</p>
          </div>
          <Button
            iconLeft={<DeleteIcon className="shrink-0" />}
            look="ghost"
            text={deleteButtonLabel}
          />
        </div>
      )}

      {state === FilesUploadState.Done ||
        (state === FilesUploadState.InProgress && (
          <Button
            iconLeft={<AddIcon className="w-6 h-6" />}
            text={selectMoreFilesButtonLabel}
          />
        ))}

      {(state === FilesUploadState.Done ||
        state === FilesUploadState.Disabled) && (
        <div className="w-full h-92px flex flex-col p-8 bg-gray-100 border-2 border-l-8 border-gray-600">
          <div className="flex items-center">
            <InfoIcon />
            <p className="text-black text-lg font-bold p-4">{warningTitle}</p>
          </div>
          <p className="text-black text-lg p-4">{warningDescription}</p>
        </div>
      )}

      {state === FilesUploadState.Error && (
        <div className="flex items-center mt-16">
          <ErrorIcon className="shrink-0 fill-red-900 mr-10" />
          <p className="text-red-900 text-base">{errorMessage}</p>
        </div>
      )}
    </div>
  );
};
