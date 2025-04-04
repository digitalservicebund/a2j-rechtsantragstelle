import { useState } from "react";
import RichText from "./RichText";

export type DetailsProps = {
  title?: string;
  content?: string;
};

const ArrowIcon = () => (
  <svg
    width="16"
    height="10"
    viewBox="0 0 16 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="group-open:rotate-180"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 0L16 0L8 10L0 0Z"
      fill="currentColor"
    />
  </svg>
);

export const Details = ({ title, content }: DetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details
      className="group focus-within:outline focus-within:outline-4 focus-within:outline-offset-4 focus-within:outline-blue-800 text-blue-800 ds-label-01-bold"
      open={isOpen}
      onToggle={(e) => setIsOpen(e.currentTarget.open)}
    >
      <summary
        aria-expanded={isOpen}
        className="summary-content flex items-baseline focus:outline-none cursor-pointer list-none"
      >
        <span className="mr-[8px]">
          <ArrowIcon />
        </span>
        {title}
      </summary>
      <div className="pl-[24px] pt-4 text-black ds-label-01-reg">
        {content && <RichText html={content} />}
      </div>
    </details>
  );
};
