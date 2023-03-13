import classNames from "classnames";

interface VisualProps {
  size?: "large" | "medium" | "small";
}
interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VisualProps {}
interface ButtonLinkProps
  extends React.ComponentPropsWithoutRef<"a">,
    VisualProps {}

const Button = (props: ButtonProps | ButtonLinkProps) => {
  const isLink = "href" in props;
  const buttonClasses = classNames("ds-button", props.className, {
    "ds-button-large": props.size == "large",
    "ds-button-small": props.size == "small",
  });
  if (isLink) {
    return (
      <a {...(props as ButtonLinkProps)} className={buttonClasses}>
        {props.children}
      </a>
    );
  } else {
    return (
      <button {...(props as ButtonProps)} className={buttonClasses}>
        {props.children}
      </button>
    );
  }
};

export default Button;
