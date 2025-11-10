import { useState } from "react";
import RichText from "../common/RichText";

export type DetailsProps = {
  title?: string;
  content?: string;
};

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="group-open:rotate-180"
    aria-hidden="true"
  >
    <path
      d="M16.59 8.29501L12 12.875L7.41 8.29501L6 9.70501L12 15.705L18 9.70501L16.59 8.29501Z"
      fill="currentColor"
    />
  </svg>
);

export const Details = ({ title, content }: DetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details
      className="group focus-within:outline-solid focus-within:outline-4 focus-within:outline-offset-4 focus-within:outline-blue-800 text-blue-800 ds-label-01-bold"
      open={isOpen}
      onToggle={(e) => setIsOpen(e.currentTarget.open)}
    >
      <summary
        aria-expanded={isOpen}
        className="summary-content flex items-center focus:outline-hidden cursor-pointer list-none p-0"
      >
        <span className="w-[24px] mr-[8px]">
          <ArrowIcon />
        </span>
        {title}
      </summary>
      <div className="pl-[32px] pt-4 text-black ds-label-01-reg">
        {content && <RichText className="leading-[1.5]" html={content} />}
      </div>
    </details>
  );
};
