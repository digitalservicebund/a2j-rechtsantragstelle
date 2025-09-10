import cx from "classnames";

type SectionProps = React.PropsWithChildren<{
  bgClass?: string;
  className?: string;
  id?: string;
  ["data-testid"]?: string;
}>;

export function GridSection({
  children,
  bgClass,
  className,
  id,
  ...rest
}: SectionProps) {
  return (
    <section id={id} className={cx(bgClass, className)} {...rest}>
      {children}
    </section>
  );
}
