import ErrorOutline from "@digitalservicebund/icons/ErrorOutline";

export type FileUploadErrorProps = {
  file: File;
  errorMessage: FileUploadErrorType;
};

export enum FileUploadErrorType {
  NoFileUploaded = "NoFileUploaded",
  InvalidFileExtension = "InvalidFileExtension",
  InvalidFileSize = "InvalidFileSize",
  Generic = "Generic",
}

const fileUploadErrorMessage = {
  [FileUploadErrorType.NoFileUploaded]: "Bitte wählen Sie eine Datei aus.",
  [FileUploadErrorType.InvalidFileExtension]:
    "Bitte laden Sie nur PDF– oder TIF–Dateien hoch.",
  [FileUploadErrorType.InvalidFileSize]:
    "Bitte laden Sie nur Dateien mit einer maximalen Größe von jeweils 100 MB hoch.",
  [FileUploadErrorType.Generic]:
    "Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
};

const getFileUploadError = (
  file: File | null,
  errorMessage: FileUploadErrorType,
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
        ? fileUploadErrorMessage[FileUploadErrorType.InvalidFileExtension]
        : null;
    case FileUploadErrorType.InvalidFileSize:
      return fileBytesToMegabytes <= fileLimitMegabytes
        ? fileUploadErrorMessage[FileUploadErrorType.InvalidFileSize]
        : null;
    default:
      return fileUploadErrorMessage[FileUploadErrorType.Generic];
  }
};

export const FileUploadError = ({
  file,
  errorMessage,
}: FileUploadErrorProps) => {
  return (
    errorMessage && (
      <div className="flex items-center mt-16">
        <ErrorOutline className="shrink-0 fill-red-900 mr-10" />
        <p className="text-red-900 text-base">
          {getFileUploadError(file, errorMessage)}
        </p>
      </div>
    )
  );
};
