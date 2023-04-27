import { ErrorOutline } from "@mui/icons-material";
import type { ReactNode } from "react";

type InputErrorProps = {
  inputName: string;
  children: ReactNode;
};

const InputError = ({ inputName, children }: InputErrorProps) => {
  return (
    <div
      id={`${inputName}-error`}
      className="mt-4 text-xs text-red-800 relative pl-20"
    >
      <ErrorOutline className="!w-16 !h-16 absolute top-0 left-0" />
      <span className="sr-only">Fehler:</span> {children}
    </div>
  );
};

export default InputError;
