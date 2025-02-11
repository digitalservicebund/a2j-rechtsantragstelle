import Heading from "~/components/Heading";
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
      {navigation.map(({ title, boxes, id }) => (
        <div key={id}>
          <Heading
            text={title}
            tagName="p"
            className="mt-40"
            look="ds-heading-03-bold"
          />
          {boxes.map(({ id, stepId, hiddenFields, sortedFields, title }) => (
            <SummaryOverviewBox
              key={id}
              title={title}
              stepId={stepId}
              id={id}
              hiddenFields={hiddenFields}
              sortedFields={sortedFields}
            />
          ))}
        </div>
      ))}
    </>
  );
};

export default SummaryOverview;
