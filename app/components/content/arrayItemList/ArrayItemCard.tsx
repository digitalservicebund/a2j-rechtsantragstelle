import { type ReactNode } from "react";
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
  content,
  editButton,
  children,
  deleteButton,
  id,
  dataTestId,
}: ArrayItemCardProps) => {
  const HeadingTag = heading?.level ?? "h3";
  return (
    <div data-testid={dataTestId} id={id} tabIndex={id ? -1 : undefined}>
      <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) gap-kern-space-large!">
        {heading && (
          <HeadingTag
            className="kern-body kern-body--large kern-body--bold p-0!"
            id={heading.id}
            tabIndex={-1}
          >
            {heading.text}
          </HeadingTag>
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
