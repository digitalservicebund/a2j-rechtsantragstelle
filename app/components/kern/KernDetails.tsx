import { useState } from "react";
import RichText from "../common/RichText";
import { GridItem } from "../layout/grid/GridItem";
import { KernIcon } from "./common/KernIcon";

export type KernDetailsProps = {
  title?: string;
  content?: string;
};

export const KernDetails = ({ title, content }: KernDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <GridItem
      mdColumn={{ start: 1, span: 9 }}
      lgColumn={{ start: 3, span: 9 }}
      xlColumn={{ start: 3, span: 9 }}
    >
      <details
        className="group detail-summary"
        open={isOpen}
        onToggle={(e) => setIsOpen(e.currentTarget.open)}
      >
        <summary
          aria-expanded={isOpen}
          className="text-kern-action-default! kern-body kern-body--bold flex items-center focus:outline-hidden cursor-pointer list-none hover:underline"
        >
          <span className="mr-kern-space-small">
            {isOpen ? (
              <KernIcon name="keyboard-arrow-up" />
            ) : (
              <KernIcon name="keyboard-arrow-down" />
            )}
          </span>
          {title}
        </summary>
        <div className="pl-kern-space-x-large pt-kern-space-small text-kern-layout-text-default">
          {content && <RichText className="leading-[1.5]" html={content} />}
        </div>
      </details>
    </GridItem>
  );
};
