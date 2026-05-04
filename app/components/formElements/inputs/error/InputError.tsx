import type { PropsWithChildren } from "react";
import { KernIcon } from "~/components/kern/common/KernIcon";

type InputErrorProps = PropsWithChildren<{
  readonly id: string;
}>;

const InputError = ({ id, children }: InputErrorProps) => {
  if (!children) return null;
  return (
    <p className="kern-error" data-testid="inputError" id={id} role="alert">
      <KernIcon
        name="emergency-home"
        className="fill-kern-feedback-danger! forced-color-adjust-auto"
      />
      <span className="text-kern-feedback-danger!">{children}</span>
    </p>
  );
};

export default InputError;
