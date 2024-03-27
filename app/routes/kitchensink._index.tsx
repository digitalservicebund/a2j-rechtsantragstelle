import { useActionData, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import Background from "~/components/Background";
import Container from "~/components/Container";
import Header from "~/components/Header";
import InfoBox from "~/components/InfoBox";
import PageContent from "~/components/PageContent";
import { strapiPageFromRequest } from "~/services/cms/index.server";
import { throw404OnProduction } from "~/services/errorPages/throw404";
import List from "~/components/List";
import FlowNavigation, { NavState } from "~/components/FlowNavigation";
import Heading from "~/components/Heading";

const DummySchema = z.object({
  text: z.string().min(1),
  textarea: z.string(),
  options: z.enum(["1", "2", "3"]),
  radioOptions: z.enum(["yes", "no", "maybe"]),
});

const validator = withZod(DummySchema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  throw404OnProduction();
  const { content, meta } = await strapiPageFromRequest({ request });
  return json({ content, meta });
};

export default function Kitchensink() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>{loaderData.meta?.title}</h1>

      <Container>
        <h2 className="ds-heading-02-reg">React components</h2>
      </Container>

      <Background backgroundColor="blue">
        <Container>
          <h3>InfoBox</h3>
          <InfoBox
            heading={{
              text: "Heading",
              tagName: "h3",
              look: "ds-heading-02-reg",
            }}
            items={[
              { label: { text: "Lorem ipsum1", tagName: "h4" } },
              { label: { text: "Lorem ipsum2", tagName: "h4" } },
            ]}
          />
        </Container>
      </Background>
      <Container>
        <h3 className="mb-16">List</h3>
        <List
          isNumeric={true}
          items={[
            { content: "Test 1", identifier: "test1" },
            { content: "Test 2", identifier: "test2" },
          ]}
        />
      </Container>
      <Container>
        <Heading text="FlowNavigation" tagName="h2" look="ds-heading-01-reg" />
        <FlowNavigation
          navItems={[
            {
              destination: ".",
              label: "Grundvoraussetzungen",
              state: NavState.DoneDisabled,
            },
            {
              destination: ".",
              label: "Das Rechtsproblem",
              state: NavState.Done,
            },
            {
              destination: ".",
              label: "Finanzielle Angaben",
              state: NavState.Current,
            },
            {
              destination: ".",
              label: "Persönliche Daten",
              state: NavState.Open,
            },
            {
              destination: ".",
              label: "Abgabe",
              state: NavState.OpenDisabled,
            },
          ]}
        />
      </Container>

      <h2>CMS components</h2>
      {loaderData.content ? (
        <PageContent content={loaderData.content} />
      ) : (
        "No kitchensink page found in CMS!"
      )}
    </div>
  );
}
