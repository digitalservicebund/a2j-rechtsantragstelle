import { z } from "zod";
import { normalizeURL } from "~/util/strings";

const CourtDetailsPropsSchema = z.object({
  name: z.string(),
  addressLabel: z.string(),
  street: z.string(),
  city: z.string(),
  websiteLabel: z.string(),
  website: z.string().url().optional(),
  phoneLabel: z.string(),
  phone: z.string().optional(),
});

type CourtDetailsProps = z.infer<typeof CourtDetailsPropsSchema>;

const CourtDetails = ({
  name,
  street,
  city,
  website,
  phone,
  addressLabel,
  websiteLabel,
  phoneLabel,
}: CourtDetailsProps) => {
  return (
    <address className="not-italic ds-stack-16">
      <h2 className="ds-heading-03-reg">{name}</h2>
      <ul className="list-none pl-0 ds-stack-16">
        <li>
          <h3 className="ds-label-02-bold">{addressLabel}</h3>
          <p className="ds-label-01-reg">
            {street}
            <br />
            {city}
          </p>
        </li>
        {website && (
          <li>
            <h3 className="sr-only">{websiteLabel}</h3>
            <p>
              <a
                href={normalizeURL(website)}
                rel="noopener"
                target="_blank"
                className="text-link"
              >
                {websiteLabel} {name}
              </a>
            </p>
          </li>
        )}
        {phone && (
          <li>
            <h3 className="ds-label-02-bold">{phoneLabel}</h3>
            <a className="text-link" href={`tel:${phone}`}>
              {phone}
            </a>
          </li>
        )}
      </ul>
    </address>
  );
};

export default CourtDetails;
