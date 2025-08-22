import ErrorOutline from "@digitalservicebund/icons/ErrorOutline";
import type { PropsWithChildren } from "react";

type InputErrorProps = PropsWithChildren<{
  readonly id: string;
  readonly keepAriaLive?: boolean; // temporary props until we run an accessibility audit
}>;

const InputError = ({ id, children, keepAriaLive = true }: InputErrorProps) => {
  return (
    <div aria-live={keepAriaLive ? "assertive" : undefined}>
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
