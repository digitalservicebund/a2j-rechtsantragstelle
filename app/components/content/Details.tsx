import { useState } from "react";
import RichText from "../common/RichText";
import IconExpandLess from "@digitalservicebund/icons/ExpandLess";
import IconExpandMore from "@digitalservicebund/icons/ExpandMore";
import { GridItem } from "../layout/grid/GridItem";

export type DetailsProps = {
  title?: string;
  content?: string;
};

export const Details = ({ title, content }: DetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <GridItem
      mdColumn={{ start: 1, span: 9 }}
      lgColumn={{ start: 3, span: 9 }}
      xlColumn={{ start: 3, span: 9 }}
    >
      <details
        className="group focus-within:outline-solid focus-within:outline-4 focus-within:outline-offset-4 focus-within:outline-blue-800 text-blue-800 ds-label-01-bold"
        open={isOpen}
        onToggle={(e) => setIsOpen(e.currentTarget.open)}
      >
        <summary
          aria-expanded={isOpen}
          className="summary-content flex items-center focus:outline-hidden cursor-pointer list-none"
        >
          <span className="mr-[8px]">
            {isOpen ? <IconExpandLess /> : <IconExpandMore />}
          </span>
          {title}
        </summary>
        <div className="pl-[32px] pt-4 text-black ds-label-01-reg">
          {content && <RichText className="leading-[1.5]" html={content} />}
        </div>
      </details>
    </GridItem>
  );
};
