import classNames from "classnames";
import { z } from "zod";
import Heading, { type HeadingProps } from "./Heading";
import InfoBoxItem, { InfoBoxItemPropsSchema } from "./InfoBoxItem";

export const InfoBoxPropsSchema = z.object({
  identifier: z.string().optional(),
  heading: z.custom<HeadingProps>().optional(),
  separator: z.boolean().optional().default(true),
  items: z.array(InfoBoxItemPropsSchema),
});

type InfoBoxProps = z.input<typeof InfoBoxPropsSchema>;

const InfoBox = ({ identifier, items, heading, separator }: InfoBoxProps) => {
  return (
    <div className="ds-stack-8 scroll-my-40" id={identifier}>
      {heading && <Heading {...heading} />}
      {items.length > 0 && (
        <ul
          className={classNames("list-none ps-0 info-box", {
            "ds-stack-48": !separator,
            "ds-stack-32": separator,
          })}
        >
          {items.map((item) => (
            <InfoBoxItem
              separator={separator}
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
      )}
    </div>
  );
};

export default InfoBox;
