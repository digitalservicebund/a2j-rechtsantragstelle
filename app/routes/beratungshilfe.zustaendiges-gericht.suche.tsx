import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Background from "~/components/Background";
import Container from "~/components/Container";
import { courtForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { ValidatedForm, validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import {
  fetchCollectionEntry,
  fetchSingleEntry,
} from "~/services/cms/index.server";
import CourtFinderHeader from "~/components/CourtFinderHeader";
import PageContent from "~/components/PageContent";
import { getSessionManager } from "~/services/session.server";
import { getReturnToURL } from "~/services/routing/getReturnToURL";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import { postcodeSchema } from "~/services/validation/postcode";

const clientSchema = z.object({ postcode: postcodeSchema });

const serverSchema = clientSchema.refine(
  (postcodeObj) => courtForPlz(postcodeObj.postcode) !== undefined,
  { path: ["postcode"], message: "notFound" },
);

const validatorClient = withZod(clientSchema);
const validatorServer = withZod(serverSchema);

export async function loader({ request }: LoaderFunctionArgs) {
  const slug = new URL(request.url).pathname;
  const sessionContext = getSessionManager("beratungshilfe/vorabcheck");

  const [common, { form, meta }] = await Promise.all([
    fetchSingleEntry("amtsgericht-common"),
    fetchCollectionEntry("vorab-check-pages", slug),
  ]);
  const { url: backURL, session } = getReturnToURL({
    request,
    session: await sessionContext.getSession(request.headers.get("Cookie")),
  });
  const headers = { "Set-Cookie": await sessionContext.commitSession(session) };
  return json({ form, common, meta, backURL }, { headers });
}

export async function action({ request }: ActionFunctionArgs) {
  const result = await validatorServer.validate(await request.formData());
  if (result.error) return validationError(result.error, result.submittedData);
  const { pathname } = new URL(request.url);
  const urlStem = pathname.substring(0, pathname.lastIndexOf("/"));
  return redirect(`${urlStem}/ergebnis/${result.data?.postcode}`);
}

export default function Index() {
  const { common, form, backURL } = useLoaderData<typeof loader>();

  return (
    <Background backgroundColor="blue">
      <div className="min-h-screen">
        <CourtFinderHeader label={common.featureName}>
          {common.searchHeading}
        </CourtFinderHeader>

        <ValidatedForm method="post" validator={validatorClient} noValidate>
          <Container>
            <PageContent content={form} />
          </Container>
          <Container>
            <ButtonNavigation
              back={{
                destination: backURL,
                label: common.backButton,
              }}
              next={{
                label: String(common.submitButton),
              }}
            />
          </Container>
        </ValidatedForm>
      </div>
    </Background>
  );
}
