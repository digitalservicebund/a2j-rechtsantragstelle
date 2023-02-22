import type { ReactNode } from "react";

type InputLabelProps = {
  id: string;
  children: ReactNode;
};

export const InputLabel = ({ id, children }: InputLabelProps) => {
  return <label htmlFor={id}>{children}</label>;
};
