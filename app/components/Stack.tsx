import type { ReactNode } from "react";

type StackProps = {
  space?: string;
  children: ReactNode;
};

const Stack = ({ space, children }: StackProps) => {
  return (
    <div
      className="ds-stack"
      style={{ "--stack-space": `var(--s-${space})` } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default Stack;
