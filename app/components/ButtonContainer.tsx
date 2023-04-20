import type { ReactNode } from "react";

interface ButtonContainerProps {
  children: ReactNode;
}

export function ButtonContainer({ children }: ButtonContainerProps) {
  return (
    <div className="button-container flex flex-wrap gap-24 md:flex-row flex-col-reverse justify-end md:justify-start">
      {children}
    </div>
  );
}
