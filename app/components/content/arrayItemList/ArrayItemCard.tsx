import { type ReactNode } from "react";
import { Badge } from "~/components/content/Badge";
import {
  ArrayItemEditButton,
  type ArrayItemEditButtonProps,
} from "./ArrayItemEditButton";

type ArrayItemCardProps = {
  readonly heading?: {
    text: ReactNode;
    id: string;
    level?: "h2" | "h3" | "h4";
  };
  /** Short label (e.g. an internal keyword) shown at the top of the card */
  readonly badge?: string;
  readonly content: ReactNode;
  readonly editButton: ArrayItemEditButtonProps;
  /** Nested content rendered below the item's content, e.g. a NestedArrayItemList */
  readonly children?: ReactNode;
  readonly deleteButton?: ReactNode;
  readonly id?: string;
  readonly dataTestId?: string;
};

export const ArrayItemCard = ({
  heading,
  badge,
  content,
  editButton,
  children,
  deleteButton,
  id,
  dataTestId,
}: ArrayItemCardProps) => {
  const HeadingTag = heading?.level ?? "h3";
  const headingElement = heading && (
    <HeadingTag
      className="kern-body kern-body--large kern-body--bold p-0!"
      id={heading.id}
      tabIndex={-1}
    >
      {heading.text}
    </HeadingTag>
  );
  return (
    <div
      data-testid={dataTestId}
      id={id}
      tabIndex={id ? -1 : undefined}
      className="flex flex-col gap-kern-space-default"
    >
      {headingElement}
      <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) gap-kern-space-large!">
        {badge && (
          <Badge className="w-full max-w-450 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap py-kern-space-small! px-kern-space-default!">
            {badge}
          </Badge>
        )}
        <div className="flex gap-kern-space-default justify-between items-center">
          {content}
          <ArrayItemEditButton {...editButton} />
        </div>
        {children}
        {deleteButton && <div className="flex justify-end">{deleteButton}</div>}
      </div>
    </div>
  );
};
