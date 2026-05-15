export const InputLabel = ({
  name,
  label,
  suffix,
}: {
  label: string | React.ReactNode;
  suffix?: string;
  name: string;
}) => {
  return (
    <label className="kern-label" htmlFor={name}>
      {label}
      {suffix && <span className="kern-label__optional">{suffix}</span>}
    </label>
  );
};
