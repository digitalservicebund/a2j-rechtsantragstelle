import { normalizeURL } from "~/util/strings";
import KernHeading from "./kern/KernHeading";

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
    <address className="not-italic">
      <KernHeading
        className="text-3xl! font-semibold!"
        tagName="h2"
        text={name}
      />
      <ul className="list-none pl-0">
        <li>
          <KernHeading
            className="text-lg! font-semibold!"
            tagName="h3"
            text={addressLabel}
          />
          <p className="font-normal! pt-6">
            {street}
            <br />
            {city}
          </p>
        </li>
        {website && (
          <li>
            <KernHeading
              className="text-lg! font-semibold!"
              tagName="h3"
              text={websiteLabel}
            />
            <p>
              <a
                className="kern-link"
                href={normalizeURL(website)}
              >{`${websiteLabel} ${name}`}</a>
            </p>
          </li>
        )}
        {phone && (
          <li>
            <KernHeading
              className="text-lg! font-semibold!"
              tagName="h3"
              text={phoneLabel}
            />
            <a className="kern-link" href={`tel:${phone}`}>
              {phone}
            </a>
          </li>
        )}
      </ul>
    </address>
  );
};

export default KernCourtDetails;
