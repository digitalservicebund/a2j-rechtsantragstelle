type FilesUploadHeaderProps = {
  title?: string;
  description?: string;
};

export const FilesUploadHeader = ({
  title,
  description,
}: FilesUploadHeaderProps) => {
  return (
    <div className="mb-16">
      <p className="ds-label-02-bold font-black">{title}</p>
      <p className="ds-body-01-reg text-gray-800">{description}</p>
    </div>
  );
};
