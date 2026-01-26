import type { PropsWithChildren } from "react";
import { KernIcon } from "../common/KernIcon";

type InputErrorProps = PropsWithChildren<{
  readonly id: string;
}>;

const InputError = ({ id, children }: InputErrorProps) => {
  return (
    <div>
      {children && (
        <p className="kern-error" id={id} role="alert">
          <KernIcon
            name="emergency-home"
            className="fill-kern-feedback-danger! mt-4"
          />
          <span className="kern-body">{children}</span>
        </p>
      )}
    </div>
  );
};

export default InputError;
