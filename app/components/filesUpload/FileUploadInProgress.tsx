import CloseIcon from "@digitalservicebund/icons/Close";
import { FC } from "react";
import { Spinner } from "./Spinner";
import Button from "../Button";

export type FileUploadInProgressProps = {
  fileName: string;
  uploadProgressLabel: string;
  cancelButtonLabel: string;
};

export const FileUploadInProgress: FC<FileUploadInProgressProps> = ({
  fileName,
  uploadProgressLabel,
  cancelButtonLabel,
}) => {
  return (
    <>
      <div className="w-full h-64 bg-gray-100 flex justify-between items-center px-16 my-14">
        <div className="max-w-md flex justify-between">
          <Spinner />
          <p
            key={fileName}
            className="max-w-2xs text-base text-black font-400 mr-8 ml-10 truncate"
          >
            {fileName}
          </p>
          <p className="max-w-32 text-base text-gray-900 font-400">
            {uploadProgressLabel}
          </p>
        </div>
        <Button
          iconLeft={<CloseIcon className="shrink-0" />}
          look="ghost"
          text={cancelButtonLabel}
        />
      </div>
    </>
  );
};
