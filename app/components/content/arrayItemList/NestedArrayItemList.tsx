import { type ComponentProps, type ReactNode } from "react";
import { DeleteButton } from "~/components/common/DeleteButton";
import { Icon } from "~/components/common/Icon";
import {
  ArrayItemEditButton,
  type ArrayItemEditButtonProps,
} from "./ArrayItemEditButton";

type NestedArrayItem = {
  key: string;
  id?: string;
  content: ReactNode;
  editButton: ArrayItemEditButtonProps;
  deleteButton: Omit<ComponentProps<typeof DeleteButton>, "className">;
};

type AddLink = {
  href: string;
  label: string;
  id?: string;
  disabled?: boolean;
};

type NestedArrayItemListProps = {
  readonly heading: ReactNode;
  readonly headingId: string;
  /** Muted text appended to the heading, e.g. "- Optional" */
  readonly headingSuffix?: ReactNode;
  readonly subtitle?: ReactNode;
  readonly items: NestedArrayItem[];
  /** Omit to hide the add link, e.g. once the maximum number of items is reached */
  readonly addLink?: AddLink;
  readonly addLinks?: AddLink[];
};

export const NestedArrayItemList = ({
  heading,
  headingId,
  headingSuffix,
  subtitle,
  items,
  addLink,
  addLinks,
}: NestedArrayItemListProps) => {
  const links = addLinks ?? (addLink ? [addLink] : []);

  return (
    <div className="kern-summary__body bg-white! border border-kern-neutral-200 rounded-(--kern-metric-border-radius-default) gap-0!">
      <div className="flex flex-col">
        <h4
          className="kern-body kern-body--default text-pretty p-0!"
          id={headingId}
          tabIndex={-1}
        >
          <span className="kern-body--bold">{heading}</span>
          {headingSuffix && (
            <>
              {" "}
              <span className="kern-body--muted">{headingSuffix}</span>
            </>
          )}
        </h4>
        {subtitle && (
          <span className="kern-body kern-body--muted">{subtitle}</span>
        )}
      </div>
      {items.length > 0 && (
        <>
          {items.map(({ key, id, content, editButton, deleteButton }) => (
            <div
              key={key}
              id={id}
              tabIndex={id ? -1 : undefined}
              className="border-b border-b-kern-grey-100 py-24 flex justify-between items-center"
            >
              <div className="kern-body kern-body--default text-pretty flex flex-col">
                {content}
              </div>
              <div className="flex gap-24">
                <ArrayItemEditButton {...editButton} />
                <DeleteButton
                  {...deleteButton}
                  className="border-1! border-kern-feedback-danger! px-8! min-w-48!"
                />
              </div>
            </div>
          ))}
        </>
      )}
      {links.length > 0 && (
        <div className="flex flex-row justify-start gap-kern-space-x-large pt-24">
          {links.map(({ href, label, id }) => (
            <a
              key={href}
              id={id}
              href={href}
              className="text-kern-action-default flex items-center"
            >
              <Icon name="plus" className="text-kern-action-default" />
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
