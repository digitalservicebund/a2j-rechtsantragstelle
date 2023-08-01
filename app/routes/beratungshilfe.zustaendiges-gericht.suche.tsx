import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Background, Button, Container } from "~/components";
import ButtonContainer from "~/components/ButtonContainer";
import { courtForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { ValidatedForm, validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import {
  getStrapiAmtsgerichtCommon,
  getStrapiVorabCheckPage,
} from "~/services/cms";
import CourtFinderHeader from "~/components/CourtFinderHeader";
import PageContent from "~/components/PageContent";
import {
  commitSession,
  getSession,
} from "~/services/session/beratungshilfe.session";
import { getReturnToURL } from "~/services/routing/getReturnToURL";

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
  const { form, meta } = await getStrapiVorabCheckPage({ slug });
  const { url: backURL, session } = getReturnToURL({
    request,
    session: await getSession(request.headers.get("Cookie")),
  });
  return json(
    {
      form,
      common: await getStrapiAmtsgerichtCommon(),
      title: meta.title,
      backURL,
    },
    { headers: { "Set-Cookie": await commitSession(session) } },
  );
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
            <ButtonContainer>
              {backURL && (
                <Button href={backURL} look="tertiary" size="large">
                  {common.backButton}
                </Button>
              )}
              <Button type="submit" size="large" id="submitButton">
                {common.submitButton}
              </Button>
            </ButtonContainer>
          </Container>
        </ValidatedForm>
      </div>
    </Background>
  );
}
