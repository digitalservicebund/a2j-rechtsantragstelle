import type { PropsWithChildren } from "react";
import { Icon } from "~/components/common/Icon";

type InputErrorProps = PropsWithChildren<{
  readonly id: string;
}>;

const InputError = ({ id, children }: InputErrorProps) => {
  if (!children) return null;
  return (
    <p
      className="kern-error flex! items-center! flex-none!"
      data-testid="inputError"
      id={id}
      role="alert"
    >
      <Icon
        name="emergency-home"
        className="w-[1.2em]! h-[1.2em]! fill-kern-feedback-danger! forced-color-adjust-auto"
      />
      <span className="text-kern-feedback-danger!">{children}</span>
    </p>
  );
};

export default InputError;
