import Heading, { type HeadingProps } from "~/components/common/Heading";
import RichText from "~/components/common/RichText";
import { GridItem } from "~/components/layout/grid/GridItem";
import { removeMarkupTags } from "~/util/strings";
import ListItem from "./ListItem";
import { type ListVariant, type ListItemProps } from "./types";

type ListProps = {
  items: ListItemProps[];
  variant: ListVariant;
  identifier?: string;
  heading?: HeadingProps;
  subheading?: string;
  wrap?: boolean;
};

const List = ({
  identifier,
  items,
  heading,
  subheading,
  variant,
  wrap,
}: ListProps) => {
  const hasImages = items.some((item) => item.image);
  const ListTag = hasImages || variant === "unordered" ? "ul" : "ol";

  const base = (
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
            <li key={item.id} className="group">
              <ListItem {...item} index={index + 1} variant={variant} />
            </li>
          ))}
      </ListTag>
    </div>
  );

  if (wrap) {
    return base;
  }

  return (
    <GridItem
      mdColumn={{ start: 1, span: 7 }}
      lgColumn={{ start: 3, span: 7 }}
      xlColumn={{ start: 3, span: 7 }}
      id={identifier}
      className="py-24 px-16 md:px-16 lg:px-0 xl:px-0"
    >
      {base}
    </GridItem>
  );
};

export function listItemNotEmpty(item: ListItemProps): boolean {
  return (
    removeMarkupTags(item.headline?.text ?? "").length > 0 ||
    removeMarkupTags(item.content ?? "").length > 0
  );
}

export default List;
