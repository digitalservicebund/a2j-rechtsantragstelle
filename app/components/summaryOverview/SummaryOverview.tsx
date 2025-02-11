import Heading from "../Heading";
import SummaryOverviewBox, {
  SummaryOverviewBoxProps,
} from "./SummaryOverviewBox";

type Props = {
  readonly navigation: Array<{
    readonly title?: string;
    readonly id: number;
    readonly boxes: SummaryOverviewBoxProps[];
  }>;
};

const SummaryOverview = ({ navigation }: Props) => {
  return (
    <>
      {navigation.map(({ title, boxes, id }) => {
        return (
          <div key={id}>
            {title && (
              <Heading
                text={title}
                tagName="p"
                className="mt-40"
                look="ds-heading-03-bold"
              />
            )}
            {boxes.map((box) => (
              <SummaryOverviewBox key={box.id} {...box} />
            ))}
          </div>
        );
      })}
    </>
  );
};

export default SummaryOverview;
