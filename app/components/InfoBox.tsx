import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import InfoBoxItem, { InfoBoxItemPropsSchema } from "./InfoBoxItem";

export const InfoBoxPropsSchema = z.object({
  identifier: z.string().optional(),
  heading: HeadingPropsSchema.optional(),
  items: z.array(InfoBoxItemPropsSchema),
});

export type InfoBoxProps = z.infer<typeof InfoBoxPropsSchema>;

const InfoBox = ({ identifier, items, heading }: InfoBoxProps) => {
  return (
    <div className="ds-stack-8" id={identifier}>
      {heading && <Heading {...heading} />}
      <ul className="list-none ds-stack-32 ps-0 info-box">
        {items.map((item) => (
          <InfoBoxItem {...item} key={item.headline?.text ?? item.content} />
        ))}
      </ul>
    </div>
  );
};

export default InfoBox;
