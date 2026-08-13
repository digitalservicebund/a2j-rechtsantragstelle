import classNames from "classnames";
import type { PropsWithChildren } from "react";

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
      data-testid="buttonContainer"
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
