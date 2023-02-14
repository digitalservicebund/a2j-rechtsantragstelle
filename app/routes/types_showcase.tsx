import { json } from "@remix-run/node";
import type { DataFunctionArgs } from "@remix-run/node";

import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError, useField } from "remix-validated-form";

import { ApplicantSchema, FamilienStandSchema } from "~/models/applicant";
import { useActionData } from "@remix-run/react";

const validator = withZod(ApplicantSchema);

export const action = async ({ request }: DataFunctionArgs) => {
  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  return json(data.data);
};

// FIXME: Refactor components into separate files
type FormInputProps = {
  name: string;
  label: string;
  type?: string;
};

export const FormInput = ({ name, label, type = "text" }: FormInputProps) => {
  const { error, getInputProps } = useField(name);
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input {...getInputProps({ type, id: name })} />
      {error && <span>{error}</span>}
    </>
  );
};

type FormSelectProps = {
  name: string;
  label: string;
  options: string[];
};

export const FormSelect = ({ name, label, options }: FormSelectProps) => {
  const { error, getInputProps } = useField(name);
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <select {...getInputProps({ id: name })}>
        {options.map((option) => {
          return (
            <option value={option} key={option}>
              {option}
            </option>
          );
        })}
      </select>
      {error && <span>{error}</span>}
    </>
  );
};

export default function Index() {
  const data = useActionData();

  return (
    <div>
      <h1>Zod Schema in Remix Formularen</h1>
      <p>Data validation in Front & Backend</p>

      <ValidatedForm
        validator={validator}
        method="post"
        defaultValues={{
          name: { first: "jane", family: "doe" },
          job: "-",
          phone_number: "030 123 123 1",
          birthday: "1990-10-23",
          address: {
            street_name: "Teststraße",
            street_no: 1,
            postcode: 12345,
            city: "Berlin",
          },
        }}
      >
        <FormInput name="name.first" label="Vorname: " />
        <FormInput name="name.family" label="Nachname: " />
        <hr />
        <FormInput name="job" label="Beruf: " />

        <FormSelect
          name="familienStand"
          label="Familienstand: "
          options={Object.keys(FamilienStandSchema.Values)}
        />
        <FormInput name="phone_number" label="Telefon: " />
        <FormInput name="birthday" label="Geburtstag: " />
        <hr />
        <FormInput name="address.street_name" label="Adresse: " />
        <FormInput
          name="address.street_no"
          label="Hausnummer: "
          type="number"
        />
        <FormInput name="address.postcode" label="PLZ: " type="number" />
        <FormInput name="address.city" label="Stadt: " />
        <hr />
        <hr />
        <input type="submit" />
      </ValidatedForm>
      <h2>Erhaltene Daten:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
