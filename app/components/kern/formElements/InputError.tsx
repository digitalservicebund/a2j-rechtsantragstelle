import type { PropsWithChildren } from "react";

type InputErrorProps = PropsWithChildren<{
  readonly id: string;
}>;

const InputError = ({ id, children }: InputErrorProps) => {
  return (
    <div>
      {children && (
        <p className="kern-error" id={id} role="alert">
          <span
            className="kern-icon kern-icon--danger kern-icon--md"
            aria-hidden="true"
          ></span>
          <span className="kern-body">{children}</span>
        </p>
      )}
    </div>
  );
};

export default InputError;
