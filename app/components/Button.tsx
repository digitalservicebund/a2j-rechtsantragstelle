import classNames from "classnames";

interface VisualProps {
  size?: "large" | "medium" | "small";
}
interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VisualProps {}

const Button = ({ children, className }: ButtonProps) => {
  return (
    <button
      className={classNames("ds-button", className, {
        "ds-button-large": size == "large",
        "ds-button-small": size == "small",
      })}
    >
      {children}
    </button>
  );
};

export default Button;
