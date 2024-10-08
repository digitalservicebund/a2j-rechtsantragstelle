import type { Renderer } from "marked";
import Heading, { type HeadingProps } from "./Heading";
import ListItem, { type ListItemProps } from "./ListItem";
import RichText from "./RichText";

export type ListProps = {
  items: ListItemProps[];
  identifier?: string;
  heading?: HeadingProps;
  subheading?: string;
  isNumeric?: boolean;
};

const paragraphRenderer: Partial<Renderer> = {
  paragraph({ tokens }) {
    return `<p class="ds-subhead max-w-full">${this.parser?.parseInline(tokens)}</p>`;
  },
};

const List = ({
  identifier,
  items,
  heading,
  subheading,
  isNumeric,
}: ListProps) => {
  return (
    <div className="ds-stack-8 scroll-my-40" id={identifier}>
      {heading && <Heading {...heading} />}
      {subheading && (
        <RichText
          markdown={subheading}
          renderer={paragraphRenderer}
          className="pt-16"
        />
      )}
      <ol className="list-none ds-stack-32 ps-0">
        {items
          // Need to filter out empty list items when conditionally rendering with mustache templating
          .filter((item) => !(item.headline?.text === "" && !item.content))
          .map((item, index) => (
            <li
              key={item.identifier ?? item.headline?.text ?? item.content}
              className="first:pt-0 scroll-my-40"
            >
              <ListItem {...item} index={isNumeric ? index + 1 : undefined} />
            </li>
          ))}
      </ol>
    </div>
  );
};

export default List;
