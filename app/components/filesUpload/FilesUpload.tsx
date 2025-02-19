import { FilesUploadHeader } from "./FilesUploadHeader";
import { FileUploadError } from "./FileUploadError";
import { FileUploadInfo } from "./FileUploadInfo";
import { FileUploadWarning } from "./FileUploadWarning";
import { FileInput } from "../inputs/FileInput";

export type FilesUploadProps = {
  name: string;
  formId?: string;
};

export const FilesUpload = ({ name, formId }: FilesUploadProps) => {
  return (
    <div className="w-full bg-white p-16">
      <FilesUploadHeader title={"title"} description={"description"} />
      <FileInput name={name} formId={formId} />
      <FileUploadInfo fileName={"testfile.pdf"} fileSize={1024} />
      <FileUploadError errorMessage="Dateien dürfen nicht größer als 100 MB sein." />
      <FileUploadWarning
        warningTitle={"Maximale Anzahl an Dateien erreicht."}
        warningDescription="Sie können maximal 5 Dateien pro Gruppe hinzufügen."
      />
    </div>
  );
};
