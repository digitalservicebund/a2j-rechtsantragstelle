import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import ListItem, { ListItemPropsSchema } from "./ListItem";

export const ListPropsSchema = z.object({
  identifier: z.string().optional(),
  heading: HeadingPropsSchema.optional(),
  items: z.array(ListItemPropsSchema),
  isNumeric: z.boolean().optional(),
});

type ListProps = z.infer<typeof ListPropsSchema>;

const List = ({ identifier, items, heading, isNumeric }: ListProps) => {
  return (
    <div className="ds-stack-8 scroll-my-40">
      {heading && <Heading {...heading} />}
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
