type FilesUploadHeaderProps = {
  title?: string;
  description?: string;
};

export const FilesUploadHeader = ({
  title,
  description,
}: FilesUploadHeaderProps) => {
  return (
    <div>
      {title && <p className="kern-label pb-6">{title}</p>}
      {description && <p className="kern-hint">{description}</p>}
    </div>
  );
};
