import ErrorIcon from "@digitalservicebund/icons/ErrorOutline";
import { FC } from "react";

export type FileUploadErrorProps = {
  errorMessage?: string;
};

export const FileUploadError: FC<FileUploadErrorProps> = ({
  errorMessage,
}) => {
  return (
    <div className="flex items-center mt-16">
      <ErrorIcon className="shrink-0 fill-red-900 mr-10" />
      <p className="text-red-900 text-base">{errorMessage}</p>
    </div>
  );
};
