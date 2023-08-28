import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container } from "~/components";
import PageContent from "~/components/PageContent";
import { strapiPageFromRequest } from "~/services/cms/index.server";
import licenses from "~/package-licenses.json";

export async function loader({ request }: LoaderArgs) {
  const { content } = await strapiPageFromRequest({ request });
  return { content, licenses };
}

export default function Index() {
  const { content, licenses } = useLoaderData<typeof loader>();

  return (
    <>
      <PageContent content={content} />
      <Container>
        {Object.entries(licenses).map((licensesEntry) => (
          <div key={licensesEntry[0]} className="ds-stack-8 mb-16">
            <h2 className="ds-heading-03-reg">{licensesEntry[0]}</h2>
            <ul>
              {licensesEntry[1].map((packageName) => (
                <li key={packageName}>{packageName}</li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
    </>
  );
}
