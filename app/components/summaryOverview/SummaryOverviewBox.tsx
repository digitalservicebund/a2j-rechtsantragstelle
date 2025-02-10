import EditButton from "@digitalservicebund/icons/CreateOutlined";
import Button from "../Button";
import Heading from "../Heading";

export type SummaryOverviewBoxProps = {
  readonly title?: string;
  readonly page: string;
  readonly sortedFields?: string;
};

const SummaryOverviewBox = ({ title, page }: SummaryOverviewBoxProps) => {
  return (
    <div className="first:pt-0 scroll-my-40 !mt-8">
      <div className="space-y-16 bg-white pt-32 pb-44 px-32">
        {title && (
          <Heading text={title} tagName="p" look="ds-heading-03-bold" />
        )}
        <Button
          iconLeft={<EditButton />}
          href={page}
          look="tertiary"
          size="large"
          className="w-fit"
        >
          Bearbeiten
        </Button>
      </div>
    </div>
  );
};

export default SummaryOverviewBox;
