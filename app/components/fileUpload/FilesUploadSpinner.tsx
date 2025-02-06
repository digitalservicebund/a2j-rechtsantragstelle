import { FC } from "react";

export const FileUploadSpinner: FC = () => {
  return (
    <div role="status" aria-live="assertive">
      <p className="sr-only">File is uploading...</p>
      <svg
        aria-hidden="true"
        aria-labelledby="title"
        aria-describedby="desc"
        role="img"
        className="h-24 w-24 animate-spin"
        viewBox="0 0 100 100"
      >
        <title id="title">Blue loader</title>
        <desc>A white circle with a dark blue border spinning</desc>
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
    </div>
  );
};
