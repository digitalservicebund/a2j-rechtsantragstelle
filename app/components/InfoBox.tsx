import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import InfoBoxItem, { InfoBoxItemPropsSchema } from "./InfoBoxItem";

export const InfoBoxPropsSchema = z.object({
  heading: HeadingPropsSchema.optional(),
  items: z.array(InfoBoxItemPropsSchema),
});

export type InfoBoxProps = z.infer<typeof InfoBoxPropsSchema>;

const InfoBox = ({ items, heading }: InfoBoxProps) => {
  return (
    <div className="ds-stack-8">
      {heading && <Heading {...heading} />}
      <ul className="list-none ds-stack-32 ps-0 info-box">
        {items.map((item, index) => (
          <InfoBoxItem {...item} key={index} />
        ))}
      </ul>
    </div>
  );
};

export default InfoBox;
