import cx from "classnames";
import { getPaddingClasses } from "./util";

type SectionProps = React.PropsWithChildren<{
  backgroundClass?: string;
  className?: string;
  pt?: string;
  pb?: string;
  id?: string;
  ["data-testid"]?: string;
}>;

// default = pt-[40px] pb-[40px]
// pt-[56px] pb-[56px]
// pt-[64px] pb-[64px]
export function GridSection({
  children,
  pt,
  pb,
  backgroundClass,
  className,
  id,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      className={cx(
        backgroundClass,
        className,
        getPaddingClasses(pt ?? "", pb ?? ""),
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
