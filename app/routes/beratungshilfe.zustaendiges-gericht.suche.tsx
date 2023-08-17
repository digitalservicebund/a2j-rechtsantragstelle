import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Background, Container } from "~/components";
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
import { getSessionForContext } from "~/services/session";
import { getReturnToURL } from "~/services/routing/getReturnToURL";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";

function isValidPostcode(postcode: string) {
  const postcodeNum = parseInt(postcode, 10);
  return postcodeNum >= 1067 && postcodeNum <= 99998;
}

const clientSchema = z.object({
  postcode: z
    .string()
    .trim()
    .length(5, { message: "length" })
    .refine((postcode) => isValidPostcode(postcode), { message: "invalid" }),
});

const serverSchema = clientSchema.refine(
  (postcodeObj) => courtForPlz(postcodeObj.postcode) !== undefined,
  { path: ["postcode"], message: "notFound" },
);

const validatorClient = withZod(clientSchema);
const validatorServer = withZod(serverSchema);

export const meta: V2_MetaFunction<typeof loader> = ({ location, data }) => [
  { title: data?.title ?? location.pathname },
];

export async function loader({ request }: LoaderArgs) {
  const slug = new URL(request.url).pathname;
  const sessionContext = getSessionForContext("beratungshilfe");

  const [common, { form, meta }] = await Promise.all([
    fetchSingleEntry("amtsgericht-common"),
    fetchCollectionEntry("vorab-check-pages", slug),
  ]);
  const { url: backURL, session } = getReturnToURL({
    request,
    session: await sessionContext.getSession(request.headers.get("Cookie")),
  });
  const headers = { "Set-Cookie": await sessionContext.commitSession(session) };
  return json({ form, common, title: meta.title, backURL }, { headers });
}

export async function action({ request }: ActionArgs) {
  const result = await validatorServer.validate(await request.formData());
  if (result.error) return validationError(result.error);
  return redirect(
    `../beratungshilfe/zustaendiges-gericht/ergebnis/${result.data?.postcode}`,
  );
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
