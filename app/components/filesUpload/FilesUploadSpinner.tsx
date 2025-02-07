import { FC } from "react";

type SpinnerProps = {
  title?: string;
};

export const FileUploadSpinner: FC<SpinnerProps> = ({ title }) => {
  return (
    <svg role="img" className="h-24 w-24 animate-spin" viewBox="0 0 100 100">
      <title>{title}</title>
      <circle
        fill="none"
        strokeWidth="10"
        className="stroke-current opacity-40 blue-800"
        cx="50"
        cy="50"
        r="40"
      />
      <circle
        fill="none"
        strokeWidth="10"
        className="stroke-current"
        strokeDasharray="250"
        strokeDashoffset="210"
        cx="50"
        cy="50"
        r="40"
      />
    </svg>
  );
};
