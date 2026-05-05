import { useState } from "react";
import { GridItem } from "../layout/grid/GridItem";
import { Icon } from "../common/Icon";
import KernRichText from "../kern/KernRichText";

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
              <Icon name="keyboard-arrow-up" />
            ) : (
              <Icon name="keyboard-arrow-down" />
            )}
          </span>
          {title}
        </summary>
        <div className="pl-kern-space-x-large pt-kern-space-small text-kern-layout-text-default">
          {content && <KernRichText className="leading-[1.5]" html={content} />}
        </div>
      </details>
    </GridItem>
  );
};
