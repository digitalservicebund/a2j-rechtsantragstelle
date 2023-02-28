import type { ReactNode } from "react";
import type { AngieSpace } from "~/components";

type StackProps = {
  space?: AngieSpace;
  children: ReactNode;
};

const Stack = ({ space, children }: StackProps) => {
  return (
    <div
      className="ds-stack"
      style={
        { "--stack-space": `var(--s-${space || "m"})` } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

export default Stack;
