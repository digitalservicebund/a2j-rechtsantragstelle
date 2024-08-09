import type { AriaRole, PropsWithChildren } from "react";

type InputLabelProps = PropsWithChildren<{
  readonly id: string;
  readonly classname?: string;
  role?: AriaRole;
}>;

const InputLabel = ({ id, children, classname, role }: InputLabelProps) => {
  return (
    <label role={role} className={classname} htmlFor={id}>
      {children}
    </label>
  );
};

export default InputLabel;
