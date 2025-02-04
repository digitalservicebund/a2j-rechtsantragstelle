import ErrorOutline from "@digitalservicebund/icons/ErrorOutline";
import { FileUploadState } from "~/services/fileUploadState/fileUploadState";

export type FileUploadErrorProps = {
  file: File | null;
  fileSize: number;
  fileExtension: string;
  errorMessage: FileUploadErrorType;
  state: FileUploadState;
};

export enum FileUploadErrorType {
  NoFileUploaded = "NoFileUploaded",
  InvalidFileExtension = "InvalidFileExtension",
  InvalidFileSize = "InvalidFileSize",
}

const fileUploadErrorMessage = {
  [FileUploadErrorType.NoFileUploaded]: "Bitte wählen Sie eine Datei aus.",
  [FileUploadErrorType.InvalidFileExtension]:
    "Bitte laden Sie nur PDF– oder TIF–Dateien hoch.",
  [FileUploadErrorType.InvalidFileSize]:
    "Bitte laden Sie nur Dateien mit einer maximalen Größe von jeweils 100 MB hoch.",
};

const getFileUploadError = (
  errorMessage: FileUploadErrorType,
  file: File | null,
): string | null => {
  const fileLimitMegabytes = 100;
  const fileBytesToMegabytes = (file?.size ?? 0) / 1024 / 1024;

  switch (errorMessage) {
    case FileUploadErrorType.NoFileUploaded:
      return file
        ? fileUploadErrorMessage[FileUploadErrorType.NoFileUploaded]
        : null;
    case FileUploadErrorType.InvalidFileExtension:
      return !(
        file?.type === "application/pdf" || file?.type === "application/tiff"
      )
        ? null
        : fileUploadErrorMessage[FileUploadErrorType.InvalidFileExtension];
    case FileUploadErrorType.InvalidFileSize:
      return fileBytesToMegabytes <= fileLimitMegabytes
        ? fileUploadErrorMessage[FileUploadErrorType.InvalidFileSize]
        : null;
    default:
      return null;
  }
};

export const FileUploadError = ({
  errorMessage,
  file,
}: FileUploadErrorProps) => {
  return (
    errorMessage && (
      <div className="flex items-center mt-16">
        <ErrorOutline className="shrink-0 fill-red-900 mr-10" />
        <p className="text-red-900 text-base">
          {getFileUploadError(errorMessage, file)}
        </p>
      </div>
    )
  );
};
