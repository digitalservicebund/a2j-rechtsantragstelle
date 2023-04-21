import { useActionData, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type {
  DataFunctionArgs,
  V2_MetaFunction,
  LoaderFunction,
} from "@remix-run/node";

import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";

import {
  Background,
  Box,
  Button,
  Container,
  Input,
  RadioGroup,
  Select,
} from "~/components";
import Header from "~/components/Header";
import InfoBox from "~/components/InfoBox";
import { getPageConfig, slugsfromURL } from "~/services/cms/getPageConfig";
import PageContent from "~/components/PageContent";

export const DummySchema = z.object({
  text: z.string().min(1),
  options: z.enum(["1", "2", "3"]),
  radioOptions: z.enum(["yes", "no", "maybe"]),
});

const validator = withZod(DummySchema);

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  { title: data.meta?.title },
  {
    name: "robots",
    content: "noindex",
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  const page = await getPageConfig(slugsfromURL(request.url)[0], {
    dontThrow: true,
  });
  console.log(page);
  return json({
    content: page?.content,
    meta: page?.meta,
  });
};

export const action = async ({ request }: DataFunctionArgs) => {
  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  return json(data.data);
};

export default function Kitchensink() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData();
  return (
    <div>
      <h1>{loaderData.meta?.title}</h1>
      <h2>{"<ValidatedForm>"}</h2>
      <ValidatedForm
        validator={validator}
        method="post"
        className="my-6"
        defaultValues={{
          text: "hello",
          radioOptions: "no",
        }}
      >
        <div className="ds-stack stack-32">
          <div className="ds-stack stack-24">
            <h3>{"<Input>"}</h3>
            <Input name="text" label="Text" />

            <h3>{"<Select>"}</h3>
            <Select
              name="options"
              label="Option"
              options={[
                { text: "bitte auswählen", value: "" },
                { text: "Option 1", value: "1" },
                { text: "Option 2", value: "2" },
                { text: "Option 3", value: "3" },
              ]}
            />

            <h3>{"<fieldset> + <legend>"}</h3>
            <fieldset>
              <legend>Leben Sie in Berlin?</legend>

              <h3>{"<RadioGroup>"}</h3>
              <RadioGroup
                name="radioOptions"
                options={[
                  { text: "ja", value: "yes" },
                  { text: "nein", value: "no" },
                  { text: "weiß nicht", value: "maybe" },
                ]}
              />
            </fieldset>
          </div>
          <div>
            <Button>Abschicken</Button>
          </div>
        </div>
      </ValidatedForm>

      {actionData && (
        <pre className="p-5 bg-gray-200 rounded-md">
          {JSON.stringify(actionData, null, 2)}
        </pre>
      )}

      <h2>React components</h2>

      <h3>Header</h3>
      <Background backgroundColor="yellow">
        <Container paddingBottom="64">
          <Header
            heading={{
              text: "Heading",
              level: 3,
              className: "ds-heading-01-reg",
            }}
            content={{ text: "Lorem **ipsum**" }}
          />
        </Container>
      </Background>

      <h3>Box</h3>
      <Background backgroundColor="blue" paddingTop="64">
        <Container backgroundColor="yellow" paddingBottom="64">
          <Box
            label={{
              text: "Label",
              level: 4,
              className: "ds-label-02-bold",
            }}
            heading={{
              text: "Heading",
              level: 3,
              className: "ds-heading-02-reg",
            }}
            content={{ text: "Lorem **ipsum**" }}
            button={{ text: "Button", href: "/", look: "tertiary" }}
          />
        </Container>
      </Background>

      <h3>InfoBox</h3>
      <Background backgroundColor="blue">
        <Container>
          <InfoBox
            heading={{
              text: "Heading",
              level: 3,
              className: "ds-heading-02-reg",
            }}
            items={[
              { label: { text: "Lorem ipsum", level: 4 } },
              { label: { text: "Lorem ipsum", level: 4 } },
            ]}
          />
        </Container>
      </Background>

      <h2>CMS components</h2>
      {loaderData.content ? (
        <PageContent content={loaderData.content} />
      ) : (
        "No kitchensink page found in CMS!"
      )}
    </div>
  );
}
