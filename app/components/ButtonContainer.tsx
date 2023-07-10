import type { PropsWithChildren } from "react";
import classNames from "classnames";

type ButtonContainerProps = PropsWithChildren & {
  reverseOrder?: boolean;
};

const ButtonContainer = ({ children, reverseOrder }: ButtonContainerProps) => {
  return (
    <div
      className={classNames("flex flex-wrap gap-24", {
        "flex-wrap-reverse": reverseOrder,
      })}
    >
      {children}
    </div>
  );
};

export default ButtonContainer;
