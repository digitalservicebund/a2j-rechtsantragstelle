import cx from "classnames";
import { getPaddingClasses } from "./util";

type SectionProps = React.PropsWithChildren<{
  className?: string;
  pt?: string;
  pb?: string;
}>;

export function GridSection({ children, pt, pb, className }: SectionProps) {
  return (
    <section className={cx(className, getPaddingClasses(pt ?? "", pb ?? ""))}>
      {children}
    </section>
  );
}
