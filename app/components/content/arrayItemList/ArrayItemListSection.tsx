import { type ComponentProps, type ReactNode } from "react";
import { AddArrayItemButton } from "~/components/common/AddArrayItemButton";

type ArrayItemListSectionProps = {
  readonly heading?: ReactNode;
  readonly headingId: string;
  readonly helperText?: ReactNode;
  /** The list items, typically ArrayItemCards */
  readonly children?: ReactNode;
  /** Rendered above the add button, e.g. a "maximum reached" InlineNotice */
  readonly notice?: ReactNode;
  readonly addButton: ComponentProps<typeof AddArrayItemButton>;
};

export const ArrayItemListSection = ({
  heading,
  headingId,
  helperText,
  children,
  notice,
  addButton,
}: ArrayItemListSectionProps) => (
  <div className="kern-summary flex flex-col gap-kern-space-default">
    <div className="flex flex-col kern-summary__header p-0!">
      <h2
        className="kern-body kern-body--large kern-body--bold p-0!"
        id={headingId}
        tabIndex={-1}
      >
        {heading}
      </h2>
      {helperText && (
        <p className="kern-body kern-body--regular p-0!">{helperText}</p>
      )}
    </div>
    {children}
    {notice}
    <AddArrayItemButton {...addButton} />
  </div>
);
