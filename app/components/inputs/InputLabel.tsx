import type { PropsWithChildren } from "react";

type InputLabelProps = PropsWithChildren<{
  readonly id: string;
}>;

const InputLabel = ({ id, children }: InputLabelProps) => {
  return <label htmlFor={id}>{children}</label>;
};

export default InputLabel;
