import CheckIcon from "@digitalservicebund/icons/Check";
import classNames from "classnames";
import {
  stateIsInProgress,
  stateIsDone,
  FileUploadState,
} from "~/services/fileUploadState/fileUploadState";

export type FileUploadStatus = {
  file: File;
  state: FileUploadState;
};

export const FileUploadStatus = ({ state, file }: FileUploadStatus) => {
  const fileUploadInProgress = stateIsInProgress(state);
  const fileUploadDone = stateIsDone(state);

  const DateiClassNames = classNames(
    "w-full h-64 bg-gray-100 border-2 border-gray-600 flex justify-between items-center text-gray-900 font-400 text-base px-16",
    {
      "bg-green-100 border-2 border-green-700": stateIsDone,
    },
  );

  return (
    <div className="w-auto h-auto">
      <p className="text-gray-900 text-m">Datei</p>
      <div className={DateiClassNames}>
        {file.name}
        {fileUploadInProgress && "wird hochgeladen..."}
        {/* Need to discuss about the loader and accessibility here */}
        {fileUploadDone && <CheckIcon className="shrink-0 fill-green-700" />}
      </div>
    </div>
  );
};
