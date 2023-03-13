import classNames from "classnames";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {}

const Button = ({ children, className }: ButtonProps) => {
  return (
    <button className={classNames("ds-button", className)}>{children}</button>
  );
};

export default Button;
