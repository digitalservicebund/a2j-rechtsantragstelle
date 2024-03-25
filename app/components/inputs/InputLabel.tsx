import type { PropsWithChildren } from "react";

type InputLabelProps = PropsWithChildren<{
  readonly id: string;
  readonly classname?: string;
}>;

const InputLabel = ({ id, children, classname }: InputLabelProps) => {
  return (
    <label className={classname} htmlFor={id}>
      {children}
    </label>
  );
};

export default InputLabel;
