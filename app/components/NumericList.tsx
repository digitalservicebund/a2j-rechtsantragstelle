import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import NumericListItem, { NumericListItemPropsSchema } from "./NumericListItem";

export const NumericListPropsSchema = z.object({
  identifier: z.string().optional(),
  heading: HeadingPropsSchema.optional(),
  items: z.array(NumericListItemPropsSchema),
  hasSeparator: z.boolean().optional(),
  isNumeric: z.boolean().optional(),
});

type NumericListProps = z.infer<typeof NumericListPropsSchema>;

const NumericList = ({
  identifier,
  items,
  heading,
  hasSeparator,
  isNumeric,
}: NumericListProps) => {
  return (
    <div className="ds-stack-8 scroll-my-40">
      {heading && <Heading {...heading} />}
      <ol className="list-none ds-stack-32 ps-0" key={identifier}>
        {items.map((item, index) => (
          <li
            key={item.identifier}
            className={`pt-6 first:pt-0 scroll-my-40 ${
              hasSeparator
                ? "border-0 border-solid border-0 border-t-2 border-gray-400 first:border-none max-w-none max-[499px]:flex-col"
                : ""
            }`}
          >
            <div className="flex flex-row gap-32 items-center">
              {isNumeric && (
                <div className="w-[40px] h-[40px] pt-[6px] text-center border border-solid border-gray-400 rounded-full">
                  {index + 1}
                </div>
              )}
              <NumericListItem
                {...item}
                key={item.headline?.text ?? item.content}
              />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default NumericList;
