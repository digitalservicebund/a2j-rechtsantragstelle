import type { ReactNode } from "react";

type InputErrorProps = {
  inputName: string;
  children: ReactNode;
};

const InputError = ({ inputName, children }: InputErrorProps) => {
  return (
    <div id={`${inputName}-error`} className="mt-2 text-xs text-red-600">
      <span className="sr-only">Fehler:</span> {children}
    </div>
  );
};

export default InputError;
