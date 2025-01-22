import EditButton from "@digitalservicebund/icons/CreateOutlined";
import Button from "~/components/Button";
import Heading from "~/components/Heading";

type AirlineAddress = {
  name?: string;
  adresse?: string;
  postleitzahl?: string;
  ort?: string;
};

type AirlineAddressCardProps = {
  readonly data: AirlineAddress;
  readonly title: string;
  readonly buttonUrl: string;
};

function AirlineDetailsOverviewCard({
  data,
  title,
  buttonUrl,
}: AirlineAddressCardProps) {
  if (Object.keys(data).length === 0) return null;

  return (
    <div className="first:pt-0 scroll-my-40 !mt-8">
      <div className="space-y-16 bg-white pt-32 pb-44 px-32">
        <Heading text={title} tagName="p" look="ds-heading-03-bold" />
        <div className="space-y-0">
          <Heading text={data.name} tagName="p" look="ds-label-01-bold" />
          <p>{data.adresse}</p>
          <p>{`${data.postleitzahl} ${data.ort}`}</p>
        </div>
        <Button
          iconLeft={<EditButton />}
          href={buttonUrl}
          look="tertiary"
          size="large"
          className="w-fit"
        >
          Bearbeiten
        </Button>
      </div>
    </div>
  );
}

export default AirlineDetailsOverviewCard;
