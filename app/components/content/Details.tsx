import { useState } from "react";
import { GridItem } from "../layout/grid/GridItem";
import { Icon } from "../common/Icon";
import RichText from "../common/RichText";

export type DetailsProps = {
  title?: string;
  content?: string;
};

function stripHtml(content: string): string {
  return content.replace(/<[^>]+>/g, "");
}

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
          id="summary"
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
          id="content"
          aria-labelledby="summary"
          className="pl-kern-space-x-large pt-kern-space-small text-kern-layout-text-default"
        >
          {content && <RichText className="leading-[1.5]" html={content} />}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {isOpen && content && `Textbeispiele: ${stripHtml(content)}`}
          </div>
        </div>
      </details>
    </GridItem>
  );
};
