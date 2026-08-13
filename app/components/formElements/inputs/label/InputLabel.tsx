import classNames from "classnames";

export const InputLabel = ({
  name,
  label,
  suffix,
  className,
}: {
  label: string | React.ReactNode;
  suffix?: string;
  name: string;
  className?: string;
}) => {
  return (
    <label className={classNames("kern-label", className)} htmlFor={name}>
      {label}
      {suffix && <span className="kern-label__optional">{suffix}</span>}
    </label>
  );
};
