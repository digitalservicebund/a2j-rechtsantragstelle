import type { Renderer } from "marked";
import { z } from "zod";
import Heading, { type HeadingProps } from "./Heading";
import ListItem, { ListItemPropsSchema } from "./ListItem";
import RichText from "./RichText";

export const ListPropsSchema = z.object({
  identifier: z.string().optional(),
  heading: z.custom<HeadingProps>().optional(),
  subheading: z.string().optional(),
  items: z.array(ListItemPropsSchema),
  isNumeric: z.boolean().optional(),
});

type ListProps = z.infer<typeof ListPropsSchema>;

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
        {items.map((item, index) => (
          <li
            key={item.identifier ?? item.headline?.text ?? item.content}
            className="first:pt-0 scroll-my-40"
          >
            <ListItem {...item} numeric={isNumeric ? index + 1 : undefined} />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default List;
