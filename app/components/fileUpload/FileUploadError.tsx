import ErrorOutline from "@digitalservicebund/icons/ErrorOutline";

export type FileUploadErrorProps = {
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

const getFileUploadError = (errorMessage: FileUploadErrorType): string => {
  switch (errorMessage) {
    case FileUploadErrorType.NoFileUploaded:
      return fileUploadErrorMessage[FileUploadErrorType.NoFileUploaded];
    case FileUploadErrorType.InvalidFileExtension:
      return fileUploadErrorMessage[FileUploadErrorType.InvalidFileExtension];
    case FileUploadErrorType.InvalidFileSize:
      return fileUploadErrorMessage[FileUploadErrorType.InvalidFileSize];
    default:
      return fileUploadErrorMessage[FileUploadErrorType.Generic];
  }
};

export const FileUploadError = ({ errorMessage }: FileUploadErrorProps) => {
  return (
    errorMessage && (
      <div className="flex items-center mt-16">
        <ErrorOutline className="shrink-0 fill-red-900 mr-10" />
        <p className="text-red-900 text-base">
          {getFileUploadError(errorMessage)}
        </p>
      </div>
    )
  );
};
