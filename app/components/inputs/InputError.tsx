import ErrorOutline from "@digitalservicebund/icons/ErrorOutline";
import type { PropsWithChildren } from "react";

type InputErrorProps = PropsWithChildren<{
  readonly id: string;
}>;

const InputError = ({ id, children }: InputErrorProps) => {
  return (
    <div aria-live="assertive">
      {children && (
        <p
          id={id}
          data-testid="inputError"
          className="mt-4 text-red-800 flex gap-x-4"
        >
          <ErrorOutline className="w-20 h-20 shrink-0 mt-2" />
          <span className="sr-only">Fehler:</span> {children}
        </p>
      )}
    </div>
  );
};

export default InputError;
