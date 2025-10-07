import cx from "classnames";
import { getPaddingClasses } from "./util";

type SectionProps = React.PropsWithChildren<{
  className?: string;
  pt?: string;
  pb?: string;
  id?: string;
  ["data-testid"]?: string;
}>;

export function GridSection({ children, pt, pb, className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cx(className, getPaddingClasses(pt ?? "", pb ?? ""))}
    >
      {children}
    </section>
  );
}
