import ErrorOutline from "@mui/icons-material/ErrorOutline";
import type { PropsWithChildren } from "react";

type InputErrorProps = PropsWithChildren<{
  id: string;
}>;

const InputError = ({ id, children }: InputErrorProps) => {
  return (
    <div aria-live="assertive">
      {children && (
        <div id={id} className="mt-4 text-xs text-red-800 relative pl-20">
          <ErrorOutline className="!w-16 !h-16 absolute top-0 left-0" />
          <span className="sr-only">Fehler:</span> {children}
        </div>
      )}
    </div>
  );
};

export default InputError;
