/* eslint-disable react/no-array-index-key */
import Heading from "../Heading";
import SummaryOverviewBox, {
  SummaryOverviewBoxProps,
} from "./SummaryOverviewBox";

type Props = {
  readonly navigation: Array<{
    readonly title?: string;
    readonly boxes: SummaryOverviewBoxProps[];
  }>;
};

const SummaryOverview = ({ navigation }: Props) => {
  return (
    <>
      {navigation.map(({ title, boxes }, index) => {
        return (
          <div key={`${title ?? ""}-${index}`}>
            {title && (
              <Heading
                text={title}
                tagName="p"
                className="mt-40"
                look="ds-heading-03-bold"
              />
            )}
            {boxes.map((box, boxIndex) => (
              <SummaryOverviewBox
                key={`${box.title ?? ""}-${boxIndex}`}
                {...box}
              />
            ))}
          </div>
        );
      })}
    </>
  );
};

export default SummaryOverview;
