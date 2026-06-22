import { useId, useState, useEffect } from "react";
import { GridItem } from "../layout/grid/GridItem";
import { Icon } from "../common/Icon";
import RichText from "../common/RichText";

export type DetailsProps = {
  title?: string;
  content?: string;
  onContentId?: (id: string) => void;
};

export const Details = ({ title, content, onContentId }: DetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();

  const summaryId = `${id}-summary`;
  const contentId = `${id}-content`;

  useEffect(() => {
    onContentId?.(contentId);
  }, [contentId, onContentId]);

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
          id={summaryId}
          aria-expanded={isOpen}
          className="text-kern-action-default! kern-body kern-body--bold flex items-center focus:outline-hidden cursor-pointer list-none hover:underline"
        >
          <span className="mr-kern-space-small flex items-center flex-none">
            <Icon
              name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              className="shrink-0 min-w-[1em] min-h-[1em]"
            />
          </span>
          {title}
        </summary>
        <div
          id={contentId}
          aria-labelledby={summaryId}
          className="pl-kern-space-x-large pt-kern-space-small text-kern-layout-text-default"
        >
          <span id={contentId} className="sr-only">
            Textbeispiele
          </span>

          {content && <RichText className="leading-[1.5]" html={content} />}
        </div>
      </details>
    </GridItem>
  );
};
