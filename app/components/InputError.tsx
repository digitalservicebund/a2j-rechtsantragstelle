import type { ReactNode } from "react";

type InputErrorProps = {
  id: string;
  children: ReactNode;
};

const InputError = ({ id, children }: InputErrorProps) => {
  return (
    <div id={`${id}-error`} className="mt-2 text-xs text-red-600">
      <span className="sr-only">Fehler:</span> {children}
    </div>
  );
};

export default InputError;
