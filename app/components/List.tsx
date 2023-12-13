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
      <ol className="list-none ds-stack-32 ps-0" key={identifier}>
        {items.map((item, index) => (
          <li key={item.identifier} className="pt-6 first:pt-0 scroll-my-40">
            <div className="flex flex-row gap-16">
              {isNumeric ? (
                <div className="min-w-[40px] w-[44px] h-[40px] pt-[4px] text-center border-2 border-solid border-gray-400 rounded-full">
                  {index + 1}
                </div>
              ) : (
                <div className="w-[16px] min-h-[1px] border border-solid border-black mt-[17px] mr-[5px] ml-[15px]" />
              )}
              <ListItem {...item} key={item.headline?.text ?? item.content} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default List;
