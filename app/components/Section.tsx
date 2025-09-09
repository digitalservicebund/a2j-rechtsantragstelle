import cx from "classnames";
type SectionProps = React.PropsWithChildren<{
  bgClass?: string;
  bleed?: boolean;
  marginTop?: string;
  marginBottom?: string;
  className?: string;
  id?: string;
  ["data-testid"]?: string;
}>;
export function Section({
  children,
  bgClass,
  bleed = false,
  marginTop = "mt-[47px]",
  marginBottom = "mb-[47px]",
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
