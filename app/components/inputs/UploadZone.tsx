import CloseIcon from "@digitalservicebund/icons/CloseOutlined";
import FileCopyOutlinedIcon from "@digitalservicebund/icons/FileCopyOutlined";
import UploadIcon from "@digitalservicebund/icons/FileUploadOutlined";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone-esm";
import Button from "../Button";

function trimLongFilename(str: string, maxLength: number) {
  if (str.length <= maxLength) return str;
  const fileEnding = str.slice(str.lastIndexOf("."), str.length);
  return `${str.slice(0, maxLength - 1)}(...)${fileEnding}`;
}

type FileMap = Record<string, string | ArrayBuffer | null>;

function humanFileSize(size: number) {
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return `${Number((size / Math.pow(1024, i)).toFixed(2))} ${
    ["B", "kB", "MB", "GB", "TB"][i]
  }`;
}

interface FileListProps extends React.ComponentPropsWithoutRef<"li"> {
  readonly filename: string;
  readonly filesize?: number;
  readonly onRemove?: () => void;
}

const FileListItem = ({
  filename,
  filesize,
  onRemove,
  ...liProps
}: FileListProps) => (
  <li
    {...liProps}
    className="bg-white p-16 flex max-w-full items-center gap-24"
  >
    <FileCopyOutlinedIcon className="text-blue-700 h-32 w-32" />
    <span className="grow">{trimLongFilename(filename, 25)}</span>
    {filesize && <span>{humanFileSize(filesize)}</span>}
    <Button
      onClick={onRemove}
      size="small"
      look="tertiary"
      iconRight={<CloseIcon />}
    >
      Entfernen
    </Button>
  </li>
);

function UploadZone(props: { readonly name: string }) {
  const [files, setFiles] = useState<FileMap>({});

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: FileMap = {};
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          newFiles[file.name] = reader.result;
          setFiles({ ...files, ...newFiles });
        };
        reader.readAsArrayBuffer(file);
        // TODO: add files to .files of the <input> field, such that dropping behaves similar to the file selection dialog
      });
    },
    [files],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`w-full border border-blue-800 rounded-md bg-white flex justify-center p-56 ${
          isDragActive ? "border-4 border-solid" : "border-2 border-dashed"
        }`}
      >
        {/*  TODO: currently JS only */}
        <input {...getInputProps()} name={props.name} />
        <div className="flex items-center flex-col">
          <UploadIcon className="!h-[3.5rem] !w-[3.5rem] text-blue-800 mb-24" />
          <div className="ds-stack-8 items-center mb-48">
            <span className="font-bold">Datei ziehen und ablegen</span>
            <span>JPG, PNG, oder PDF, nicht größer als 10 MB</span>
          </div>
          <Button onClick={open} size="large" look="primary" type="button">
            Datei auswählen
          </Button>
        </div>
      </div>
      {Object.keys(files).length > 0 && (
        <ul className="mt-80 mb-40 ds-stack-16 pl-0">
          {Object.entries(files).map(([filename, file]) => (
            <FileListItem
              key={filename}
              filename={filename}
              filesize={typeof file !== "string" ? file?.byteLength : undefined}
              onRemove={() => {
                const { [filename]: _, ...remainingFiles } = files;
                setFiles(remainingFiles);
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default UploadZone;
