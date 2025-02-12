import { FC } from "react";

export type FilesUploadHeaderProps = {
  title: string;
  description?: string;
};

export const FilesUploadHeader: FC<FilesUploadHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="mb-16">
      <p className="text-base text-900 font-black">{title}</p>
      <p className="text-base text-gray-800 text-400">{description}</p>
    </div>
  );
};
