import { removeMarkupTags } from "~/util/strings";
import Heading, { type HeadingProps } from "../Heading";
import ListItem from "./ListItem";
import RichText from "../RichText";
import { type ListVariant, type ListItemProps } from "./types";

type ListProps = {
  items: ListItemProps[];
  variant: ListVariant;
  identifier?: string;
  heading?: HeadingProps;
  subheading?: string;
};

const List = ({
  identifier,
  items,
  heading,
  subheading,
  variant,
}: ListProps) => {
  const hasImages = items.some((item) => item.image);
  const ListTag = hasImages || variant === "unordered" ? "ul" : "ol";

  return (
    <div className="ds-stack ds-stack-32" id={identifier}>
      <div className="ds-stack ds-stack-16">
        {heading && <Heading {...heading} />}
        {subheading && <RichText html={subheading} />}
      </div>
      <ListTag className="list-none ps-0">
        {items
          // Need to filter out empty list items when conditionally rendering with mustache templating
          .filter(listItemNotEmpty)
          .map((item, index) => (
            <li
              key={item.identifier ?? item.headline?.text ?? item.content}
              className="group"
            >
              <ListItem {...item} index={index + 1} variant={variant} />
            </li>
          ))}
      </ListTag>
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
