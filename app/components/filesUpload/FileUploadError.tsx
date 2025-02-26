import ErrorIcon from "@digitalservicebund/icons/ErrorOutline";

type FileUploadErrorProps = {
  errorMessage?: string;
};

export const FileUploadError = ({ errorMessage }: FileUploadErrorProps) => {
  return (
    <div className="flex items-center mt-16 mb-16">
      <ErrorIcon className="shrink-0 fill-red-900 mr-10" />
      <p className="text-red-900 text-base">{errorMessage}</p>
    </div>
  );
};
