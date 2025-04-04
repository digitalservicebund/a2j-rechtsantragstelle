import ErrorOutline from "@digitalservicebund/icons/ErrorOutline";
import type { PropsWithChildren } from "react";
import { forwardRef } from "react";

type InputErrorProps = PropsWithChildren<{
  readonly id: string;
  readonly tabIndex?: number;
}>;

function InputError(
  { id, children, tabIndex }: InputErrorProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <div>
      {children && (
        <p
          id={id}
          ref={ref}
          tabIndex={tabIndex}
          data-testid="inputError"
          className="mt-4 text-red-800 flex gap-x-4"
        >
          <ErrorOutline className="w-20 h-20 shrink-0 mt-2" />
          <span className="sr-only">Fehler:</span> {children}
        </p>
      )}
    </div>
  );
}

export default forwardRef<HTMLDivElement, InputErrorProps>(InputError);
