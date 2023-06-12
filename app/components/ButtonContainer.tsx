import type { PropsWithChildren } from "react";

export default ({ children }: PropsWithChildren) => {
  return <div className="flex flex-wrap gap-24">{children}</div>;
};
