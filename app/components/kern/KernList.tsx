import { GridItem } from "~/components/layout/grid/GridItem";
import { removeMarkupTags } from "~/util/strings";
import KernListItem from "./KernListItem";
import { ListItemProps, ListVariant } from "../content/list/types";
import KernRichText from "./KernRichText";
import KernHeading from "./KernHeading";
import { HeadingProps } from "../common/Heading";

type ListProps = {
  items: ListItemProps[];
  variant: ListVariant;
  identifier?: string;
  heading?: HeadingProps;
  subheading?: string;
  wrap?: boolean;
};

const KernList = ({
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
    <div id={identifier}>
      <div>
        {heading && (
          <KernHeading {...heading} className="kern-heading-large! mb-16!" />
        )}
        {subheading && <KernRichText html={subheading} />}
      </div>
      <ListTag className="list-none ps-0">
        {items
          // Need to filter out empty list items when conditionally rendering with mustache templating
          .filter(listItemNotEmpty)
          .map((item, index) => (
            <li key={item.id} className="group list-none">
              <KernListItem {...item} index={index + 1} variant={variant} />
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
      mdColumn={{ start: 1, span: 8 }}
      lgColumn={{ start: 3, span: 8 }}
      xlColumn={{ start: 3, span: 8 }}
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

export default KernList;
