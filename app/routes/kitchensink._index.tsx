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
import PageContent from "~/components/PageContent";
import { getStrapiPage, strapiPageFromRequest } from "~/services/cms";

export const DummySchema = z.object({
  text: z.string().min(1),
  options: z.enum(["1", "2", "3"]),
  radioOptions: z.enum(["yes", "no", "maybe"]),
});

const validator = withZod(DummySchema);

export const meta: V2_MetaFunction<typeof loader> = ({ data, location }) => [
  { title: data ? data.meta.title : location.pathname },
  {
    name: "robots",
    content: "noindex",
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  const { content, meta } = await strapiPageFromRequest({ request });
  return json({ content, meta });
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
        noValidate
      >
        <div className="ds-stack-32">
          <div className="ds-stack-24">
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

      <Container>
        <h2 className="ds-heading-02-reg">React components</h2>
      </Container>

      <div>
        <Container paddingBottom="8">
          <div className="ds-stack-8">
            <h3>Background</h3>
            <p>
              A simple wrapper with a background color. You can optionally add
              top and bottom padding. Defaults to zero padding.
            </p>
            <code>
              <pre>
                {
                  '<Background backgroundColor="yellow" paddingTop="32" paddingBottom="32">\n'
                }
                {" some inner content\n"}
                {"</Background>"}
              </pre>
            </code>
          </div>
        </Container>
        <Background backgroundColor="yellow" paddingTop="32" paddingBottom="32">
          inner content
        </Background>
      </div>

      <div>
        <Container paddingBottom="8">
          <div className="ds-stack-8">
            <h3>Container</h3>
            <p>
              A wrapper to limit the width of the content + centering of the
              content. You can change top and bottom padding. Defaults to 40px
              top and 48px bottom padding. You can optionally add a background
              color. That background color is only behind the content.
            </p>
            <code>
              <pre>
                {
                  '<Container backgroundColor="yellow" paddingTop="16" paddingBottom="16">\n'
                }
                {" foo inner content\n"}
                {"</Container>"}
              </pre>
            </code>
          </div>
        </Container>
        <Container backgroundColor="yellow" paddingTop="16" paddingBottom="16">
          inner content
        </Container>
      </div>

      <div>
        <Container paddingBottom="8">
          <div className="ds-stack-8">
            <h3>Background + Container combination</h3>
            <p>It's common to combine Background and Container.</p>
            <code>
              <pre>
                {
                  '<Background backgroundColor="yellow" paddingTop="32" paddingBottom="32">\n'
                }
                {'  <Container backgroundColor="white">\n'}
                {"    inner content\n"}
                {"  </Container>\n"}
                {"</Background>"}
              </pre>
            </code>
          </div>
        </Container>
        <Background backgroundColor="yellow" paddingTop="32" paddingBottom="32">
          <Container backgroundColor="white">inner content</Container>
        </Background>
      </div>

      <div>
        <Container paddingBottom="8">
          <div className="ds-stack-8">
            <h3>Header</h3>
            <p>A simple headline + text combination.</p>
            <code>
              <pre>{`
<Container>
  <Header
    heading={{
      text: "Heading",
      tagName: "h3",
      look: "ds-heading-01-reg",
    }}
    content={{ text: "Lorem **ipsum**" }}
  />
</Container>
            `}</pre>
            </code>
          </div>
        </Container>
        <Container>
          <Header
            heading={{
              text: "Heading",
              tagName: "h3",
              look: "ds-heading-01-reg",
            }}
            content={{ text: "Lorem **ipsum**" }}
          />
        </Container>
      </div>

      <h3>Box</h3>
      <Background backgroundColor="blue" paddingTop="64">
        <Container backgroundColor="yellow" paddingBottom="64">
          <Box
            label={{
              text: "Label",
              tagName: "p",
              look: "ds-label-02-bold",
            }}
            heading={{
              text: "Heading",
              tagName: "h3",
              look: "ds-heading-02-reg",
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
              tagName: "h3",
              look: "ds-heading-02-reg",
            }}
            items={[
              { label: { text: "Lorem ipsum", tagName: "h4" } },
              { label: { text: "Lorem ipsum", tagName: "h4" } },
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
