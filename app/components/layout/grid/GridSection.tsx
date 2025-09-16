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

export function GridSection({
  children,
  pt,
  pb,
  backgroundClass,
  className,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cx(
        backgroundClass,
        className,
        getPaddingClasses(pt ?? "", pb ?? ""),
      )}
    >
      {children}
    </section>
  );
}
