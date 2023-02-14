import { ApplicantSchema } from "~/models/applicant";
import type { ApplicantType } from "~/models/applicant";

const user = {
  name: {
    family: "familyname",
    first: "firstname",
  },
  job: "job",
  familienStand: "ledig",
  birthday: "1990-10-20", //FIXME: reliably parse German date
  address: {
    street_name: "streetname",
    street_no: 123,
    postcode: 12345,
    city: "city",
  },
  phone_number: "030 123 123",
};

function render_parse_user(user: ApplicantType) {
  const birthday_german_fmt = user.birthday.toLocaleDateString("de-DE");
  return (
    <div>
      <div>
        Name: {user.name.first} {user.name.family}
      </div>
      <div>Familienstand: {user.familienStand}</div>
      <div>Geburtstag: {birthday_german_fmt}</div>
      <div>
        Adresse: {user.address.street_name} {user.address.street_no} in{" "}
        {user.address.postcode} {user.address.city}
      </div>
      <div>Job: {user.job}</div>
      <div>Telefonnummer: {user.phone_number}</div>
    </div>
  );
}

export default function Index() {
  const user_parsed = ApplicantSchema.safeParse(user);

  return (
    <div>
      {user_parsed.success
        ? render_parse_user(user_parsed.data)
        : JSON.stringify(user_parsed.error)}
    </div>
  );
}
