import ErrorOutline from "@digitalservicebund/icons/ErrorOutline";
import { FC } from "react";

export type FilesUploadErrorProps = {
  errorMessage: FilesUploadErrorType;
};

export enum FilesUploadErrorType {
  NoFileUploaded = "NoFileUploaded",
  InvalidFileExtension = "InvalidFileExtension",
  InvalidFileSize = "InvalidFileSize",
  Generic = "Generic",
}

const filesUploadErrorMessage = {
  [FilesUploadErrorType.NoFileUploaded]: "Bitte wählen Sie eine Datei aus.",
  [FilesUploadErrorType.InvalidFileExtension]:
    "Bitte laden Sie nur PDF– oder TIF–Dateien hoch.",
  [FilesUploadErrorType.InvalidFileSize]:
    "Bitte laden Sie nur Dateien mit einer maximalen Größe von jeweils 100 MB hoch.",
  [FilesUploadErrorType.Generic]:
    "Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
};

const getFilesUploadError = (errorMessage: FilesUploadErrorType): string => {
  switch (errorMessage) {
    case FilesUploadErrorType.NoFileUploaded:
      return filesUploadErrorMessage[FilesUploadErrorType.NoFileUploaded];
    case FilesUploadErrorType.InvalidFileExtension:
      return filesUploadErrorMessage[FilesUploadErrorType.InvalidFileExtension];
    case FilesUploadErrorType.InvalidFileSize:
      return filesUploadErrorMessage[FilesUploadErrorType.InvalidFileSize];
    default:
      return filesUploadErrorMessage[FilesUploadErrorType.Generic];
  }
};

export const FilesUploadError: FC<FilesUploadErrorProps> = ({
  errorMessage,
}) => {
  return (
    errorMessage && (
      <div className="flex items-center mt-16">
        <ErrorOutline className="shrink-0 fill-red-900 mr-10" />
        <p className="text-red-900 text-base">
          {getFilesUploadError(errorMessage)}
        </p>
      </div>
    )
  );
};
