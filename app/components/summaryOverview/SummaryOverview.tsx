import Heading from "~/components/Heading";
import SummaryOverviewBoxWrapped, {
  SummaryOverviewBoxWrappedProps,
} from "./SummaryOverviewBoxWrapped";

type Props = {
  readonly navigation: Array<{
    readonly title: string;
    readonly id: number;
    readonly boxes: SummaryOverviewBoxWrappedProps[];
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
          {boxes.map(({ id, stepId, boxItems, title: boxTitle }) => (
            <SummaryOverviewBoxWrapped
              key={id}
              title={boxTitle}
              stepId={stepId}
              id={id}
              boxItems={boxItems}
            />
          ))}
        </div>
      ))}
    </>
  );
};

export default SummaryOverview;
