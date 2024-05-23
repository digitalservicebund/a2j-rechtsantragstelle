import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import InfoBoxItem, { InfoBoxItemPropsSchema } from "./InfoBoxItem";
import classNames from "classnames";

export const InfoBoxPropsSchema = z.object({
  identifier: z.string().optional(),
  heading: HeadingPropsSchema.optional(),
  separator: z.boolean().optional(),
  items: z.array(InfoBoxItemPropsSchema),
});

type InfoBoxProps = z.infer<typeof InfoBoxPropsSchema>;

const InfoBox = ({ identifier, items, heading, separator }: InfoBoxProps) => {
  const showSeparator = separator ?? true;

  return (
    <div className="ds-stack-8 scroll-my-40" id={identifier}>
      {heading && <Heading {...heading} />}
      <ul
        className={classNames("list-none ps-0 info-box", {
          "ds-stack-48": !showSeparator,
          "ds-stack-32": showSeparator,
        })}
      >
        {items.map((item) => (
          <InfoBoxItem
            separator={showSeparator}
            {...item}
            key={
              item.identifier ??
              item.headline?.text ??
              item.content ??
              item.label?.text ??
              ""
            }
          />
        ))}
      </ul>
    </div>
  );
};

export default InfoBox;
