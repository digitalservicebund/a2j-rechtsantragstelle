import type { PropsWithChildren } from "react";
import classNames from "classnames";

type ButtonContainerProps = PropsWithChildren & {
  readonly reverseOrder?: boolean;
  readonly className?: string;
};

const ButtonContainer = ({
  children,
  reverseOrder,
  className,
}: ButtonContainerProps) => {
  return (
    <div
      className={classNames(
        "flex flex-wrap gap-24",
        {
          "flex-wrap-reverse": reverseOrder,
        },
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ButtonContainer;
