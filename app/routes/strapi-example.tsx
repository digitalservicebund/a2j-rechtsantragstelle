import { json } from "@remix-run/node";
import type { DataFunctionArgs, LoaderFunction } from "@remix-run/node";

import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";

import { ApplicantSchema } from "~/models/applicant";
import { useActionData, useLoaderData } from "@remix-run/react";

import cms from "~/services/cms";
import { Locale } from "~/services/cms/models/Locale";
import PageContent from "~/components/PageContent";

type StrapiExampleContent = {
  page: [];
  validatedForm: [];
};

const validator = withZod(ApplicantSchema);

export const loader: LoaderFunction = async ({ params }) => {
  return json({
    data: await cms().getPage("strapi-example", Locale.de),
  });
};

export const action = async ({ request }: DataFunctionArgs) => {
  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  return json(data.data);
};

export default function Index() {
  const content = useLoaderData()?.data as StrapiExampleContent;
  const data = useActionData();

  return (
    <div className="block p-6 rounded-lg shadow-lg max-w-xl">
      <PageContent content={content?.page} />

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
        <PageContent content={content?.validatedForm} />

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
