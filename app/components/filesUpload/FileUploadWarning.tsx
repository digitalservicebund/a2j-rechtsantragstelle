import InfoIcon from "@digitalservicebund/icons/LightbulbOutlined";

export type FileUploadWarningProps = {
  warningTitle: string;
  warningDescription?: string;
};

export const FileUploadWarning = ({
  warningTitle,
  warningDescription,
}: FileUploadWarningProps) => {
  return (
    <div className="w-full h-92px flex flex-col p-8 bg-gray-100 border-2 border-l-8 border-gray-600">
      <div className="flex items-center">
        <InfoIcon className="shrink-0" />
        <p className="text-black text-lg font-bold p-4">{warningTitle}</p>
      </div>
      <p className="text-black text-lg p-4">{warningDescription}</p>
    </div>
  );
};
