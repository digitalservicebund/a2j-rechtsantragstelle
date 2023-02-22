import { json } from "@remix-run/node";
import type { DataFunctionArgs } from "@remix-run/node";

import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";

import { ApplicantSchema, FamilienStandSchema } from "~/models/applicant";
import { useActionData } from "@remix-run/react";

import { Input, Select } from "~/components";

const validator = withZod(ApplicantSchema);

export const action = async ({ request }: DataFunctionArgs) => {
  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  return json(data.data);
};

export default function Index() {
  const data = useActionData();

  return (
    <div className="block p-6 rounded-lg shadow-lg max-w-xl">
      <h1>Zod Schema in Remix Formularen</h1>
      <p>Data validation in Front & Backend 🤯</p>

      <ValidatedForm
        validator={validator}
        method="post"
        className="my-6"
        defaultValues={{
          name: { first: "Jane", family: "Doe" },
          job: "",
          phoneNumber: "030 123 123 1",
          birthday: "23.01.1993",
          address: {
            streetName: "Teststraße",
            streetNumber: "1",
            postcode: 12345,
            city: "Berlin",
          },
        }}
      >
        <Input name="name.first" label="Vorname" />
        <Input name="name.family" label="Nachname" />
        <Input name="birthday" label="Geburtstag" />
        <Select
          name="familienStand"
          label="Familienstand"
          options={Object.keys(FamilienStandSchema.Values)}
        />
        <Input name="job" label="Beruf" />
        <Input name="phoneNumber" label="Telefon" />

        <div className="flex flex-row">
          <div className="basis-4/5 mr-2">
            <Input name="address.streetName" label="Straße" />
          </div>
          <div className="basis-1/5">
            <Input name="address.streetNumber" label="Hausnummer" />
          </div>
        </div>

        <Input name="address.city" label="Stadt" />
        <Input name="address.postcode" label="PLZ" type="number" />

        <div className="flex flex-row place-content-end">
          <button type="submit" className="border-2 rounded-lg px-5 py-2">
            Abschicken
          </button>
        </div>
      </ValidatedForm>

      {data && (
        <pre className="p-5 bg-gray-200 rounded-md">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
