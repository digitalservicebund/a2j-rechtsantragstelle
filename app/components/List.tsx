import { removeMarkupTags } from "~/util/strings";
import Heading, { type HeadingProps } from "./Heading";
import ListItem, { type ListItemProps } from "./ListItem";
import RichText from "./RichText";

export type ListProps = {
  items: ListItemProps[];
  identifier?: string;
  heading?: HeadingProps;
  subheading?: string;
  variant?: "unordered" | "numbered";
};

const List = ({
  identifier,
  items,
  heading,
  subheading,
  variant = "unordered",
}: ListProps) => {
  return (
    <div className="ds-stack-8 scroll-my-40" id={identifier}>
      {heading && <Heading {...heading} />}
      {subheading && <RichText html={subheading} className="pt-16" />}
      <ol className="list-none ds-stack-32 ps-0">
        {items
          // Need to filter out empty list items when conditionally rendering with mustache templating
          .filter(listItemNotEmpty)
          .map((item, index) => (
            <li
              key={item.identifier ?? item.headline?.text ?? item.content}
              className="first:pt-0 scroll-my-40"
            >
              <ListItem
                {...item}
                index={variant === "numbered" ? index + 1 : undefined}
              />
            </li>
          ))}
      </ol>
    </div>
  );
};

export function listItemNotEmpty(item: ListItemProps): boolean {
  return (
    removeMarkupTags(item.headline?.text ?? "").length > 0 ||
    removeMarkupTags(item.content ?? "").length > 0
  );
}

export default List;
