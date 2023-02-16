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
  className?: string;
  type?: string;
};

export const FormInput = ({
  name,
  label,
  type = "text",
  className = "",
}: FormInputProps) => {
  const { error, getInputProps } = useField(name);
  // Floating label inspired by https://flowbite.com/docs/forms/floating-label/
  return (
    <div className={`m-1 ${className}`}>
      <div className="relative">
        <input
          {...getInputProps({ type, id: name })}
          className={`${
            error ? "border-red-600" : "border-gray-300"
          } block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
          placeholder=" "
        />
        <label
          htmlFor={name}
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
        >
          {label}
        </label>
        {error && <span className="mt-2 text-xs text-red-600">{error}</span>}
      </div>
    </div>
  );
};

type FormSelectProps = {
  name: string;
  label: string;
  options: string[];
  className?: string;
};

export const FormSelect = ({
  name,
  label,
  options,
  className = "",
}: FormSelectProps) => {
  const { error, getInputProps } = useField(name);
  return (
    <div className={`m-1 ${className}`}>
      <div className={`relative`}>
        <label
          htmlFor={name}
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
        >
          {label}
        </label>
        <select
          {...getInputProps({ id: name })}
          className="border-gray-300 block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        >
          {options.map((option) => {
            return (
              <option value={option} key={option}>
                {option}
              </option>
            );
          })}
        </select>
        {error && <span className="mt-2 text-xs text-red-600 ">{error}</span>}
      </div>
    </div>
  );
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
            streetNumber: 1,
            postcode: 12345,
            city: "Berlin",
          },
        }}
      >
        <div className="flex flex-row">
          <FormInput name="name.first" label="Vorname" className="basis-1/2" />
          <FormInput
            name="name.family"
            label="Nachname"
            className="basis-1/2"
          />
        </div>

        <div className="flex flex-row">
          <FormInput name="birthday" label="Geburtstag" className="basis-1/2" />
          <FormSelect
            name="familienStand"
            label="Familienstand "
            options={Object.keys(FamilienStandSchema.Values)}
            className="basis-1/2"
          />
        </div>

        <div className="flex flex-row">
          <FormInput name="job" label="Beruf" className="basis-1/2" />
          <FormInput name="phoneNumber" label="Telefon" className="basis-1/2" />
        </div>

        <div className="flex flex-row">
          <FormInput
            name="address.streetName"
            label="Adresse"
            className="basis-4/5"
          />
          <FormInput
            name="address.streetNumber"
            label="Hausnummer"
            className="basis-1/5"
          />
        </div>
        <div className="flex flex-row">
          <FormInput
            name="address.postcode"
            label="PLZ"
            type="number"
            className="basis-1/2"
          />
          <FormInput name="address.city" label="Stadt" className="basis-1/2" />
        </div>
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
