import ErrorOutline from "@mui/icons-material/ErrorOutline";
import type { PropsWithChildren } from "react";

type InputErrorProps = PropsWithChildren<{
  id: string;
}>;

const InputError = ({ id, children }: InputErrorProps) => {
  return (
    <div aria-live="assertive">
      {children && (
        <div
          id={id}
          data-testid="inputError"
          className="mt-4 text-red-800 flex items-center gap-x-4"
        >
          <ErrorOutline />
          <span className="sr-only">Fehler:</span> {children}
        </div>
      )}
    </div>
  );
};

export default InputError;
