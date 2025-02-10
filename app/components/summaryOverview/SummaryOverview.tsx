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
          // eslint-disable-next-line react/no-array-index-key
          <div key={`${title ?? ""}-${index}`}>
            {title && (
              <Heading text={title} tagName="h2" look="ds-heading-03-bold" />
            )}
            {boxes.map((box) => (
              <SummaryOverviewBox key={box.title} {...box} />
            ))}
          </div>
        );
      })}
    </>
  );
};

export default SummaryOverview;
