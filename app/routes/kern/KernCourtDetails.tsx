import { normalizeURL } from "~/util/strings";
import KernHeading from "../../components/kern/KernHeading";

type KernCourtDetailsProps = {
  name: string;
  addressLabel: string;
  street: string;
  city: string;
  websiteLabel: string;
  phoneLabel: string;
  website?: string;
  phone?: string;
};

const KernCourtDetails = ({
  name,
  street,
  city,
  website,
  phone,
  addressLabel,
  websiteLabel,
  phoneLabel,
}: KernCourtDetailsProps) => {
  return (
    <address className="not-italic flex flex-col gap-kern-space-default">
      <KernHeading
        tagName="h2"
        size="large"
        text={name}
      />
      <div className="flex flex-col">
        <span className="kern-body kern-body--bold m-0! p-0!">{addressLabel}</span>
        <span className="kern-body m-0! p-0! text-kern-layout-text-default">
          {street}
          <br />
          {city}
        </span>
      </div>
      {website && (
        <div className="flex flex-col">
          <span className="kern-body kern-body--bold m-0! p-0!">
            {websiteLabel}
          </span>
          <a
            className="kern-link p-0!"
            href={normalizeURL(website)}
          >{`${websiteLabel} ${name}`}</a>
        </div>
      )}
      {phone && (
        <div className="flex flex-col">
          <span className="kern-body kern-body--bold m-0! p-0!">
            {phoneLabel}
          </span>
          <a className="kern-link p-0!" href={`tel:${phone}`}>
            {phone}
          </a>
        </div>
      )}
    </address>
  );
};

export default KernCourtDetails;
