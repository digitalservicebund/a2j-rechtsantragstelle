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
  formFlowPage?: boolean;
};

const List = ({
  identifier,
  items,
  heading,
  subheading,
  variant,
  formFlowPage,
}: ListProps) => {
  const hasImages = items.some((item) => item.image);
  const ListTag = hasImages || variant === "unordered" ? "ul" : "ol";

  // Form flow pages has content which is controlled by the content pages grid. So the layout is different and need to be handled differently.
  if (formFlowPage) {
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
              <li key={item.id} className="group">
                <ListItem {...item} index={index + 1} variant={variant} />
              </li>
            ))}
        </ListTag>
      </div>
    );
  }
  return (
    <GridItem
      span={12}
      mdSpan={7}
      mdStart={1}
      lgStart={3}
      lgSpan={7}
      xlStart={3}
      xlSpan={7}
      id={identifier}
      className="py-24"
    >
      <div className="ds-stack ds-stack-32">
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
