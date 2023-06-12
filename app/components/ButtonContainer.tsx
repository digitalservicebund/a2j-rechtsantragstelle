import type { PropsWithChildren } from "react";

const ButtonContainer = ({ children }: PropsWithChildren) => {
  return <div className="flex flex-wrap gap-24">{children}</div>;
};

export default ButtonContainer;
