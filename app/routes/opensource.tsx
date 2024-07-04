import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import PageContent from "~/components/PageContent";
import { strapiPageFromRequest } from "~/services/cms/index.server";
import { sendSentryMessage } from "~/services/logging";
import { dependencies } from "~/services/openSourceLicenses/dependencies.server";
import LicenseList from "~/services/openSourceLicenses/LicenseList";
import * as Sentry from "@sentry/remix";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("Sending test message from open source page to sentry");
  sendSentryMessage(
    `This is a test message from the open source page`,
    "warning",
  );

  try {
    throw new Error("This is a test error from the open source page");
  } catch (e) {
    Sentry.captureException(e);
  }

  const { content, meta } = await strapiPageFromRequest({ request });
  return json({
    meta,
    content,
    dependencies,
  });
};

export default function Index() {
  const { content, dependencies } = useLoaderData<typeof loader>();
  return (
    <>
      <PageContent content={content} />
      <Container>
        <LicenseList dependencies={dependencies} />
      </Container>
    </>
  );
}
