import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { data, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import Background from "~/components/Background";
import Container from "~/components/Container";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import PageContent from "~/components/PageContent";
import type { FlowId } from "~/domains/flowIds";
import { StrapiFormComponents } from "~/services/cms/components/StrapiFormComponents";
import { fetchFlowPage, fetchTranslations } from "~/services/cms/index.server";
import { courtForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { getReturnToURL } from "~/services/routing/getReturnToURL";
import { getSessionManager } from "~/services/session.server";
import { postcodeSchema } from "~/services/validation/postcode";

const clientSchema = z.object({ postcode: postcodeSchema });

const serverSchema = clientSchema.refine(
  (postcodeObj) => courtForPlz(postcodeObj.postcode) !== undefined,
  { path: ["postcode"], message: "notFound" },
);

const validatorClient = withZod(clientSchema);
const validatorServer = withZod(serverSchema);

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionManager = getSessionManager("/beratungshilfe/vorabcheck");

  const [common, { pre_form, form, meta, nextButtonLabel }] = await Promise.all(
    [
      fetchTranslations("amtsgericht"),
      fetchFlowPage(
        "vorab-check-pages",
        "/beratungshilfe/zustaendiges-gericht" as FlowId,
        "suche",
      ),
    ],
  );
  const { url: backURL, session } = getReturnToURL({
    request,
    session: await sessionManager.getSession(request.headers.get("Cookie")),
  });
  const headers = { "Set-Cookie": await sessionManager.commitSession(session) };
  return data(
    { common, pre_form, form, meta, backURL, nextButtonLabel },
    { headers },
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const result = await validatorServer.validate(await request.formData());
  if (result.error) return validationError(result.error, result.submittedData);
  const { pathname } = new URL(request.url);
  const urlStem = pathname.substring(0, pathname.lastIndexOf("/"));
  return redirect(`${urlStem}/ergebnis/${result.data?.postcode}`);
}

export default function Index() {
  const {
    data: { common, pre_form, form, backURL, nextButtonLabel },
  } = useLoaderData<typeof loader>();

  return (
    <Background backgroundColor="blue">
      <div className="min-h-screen">
        <Container>
          <PageContent className="ds-stack-32" content={pre_form} />
        </Container>
        <ValidatedForm method="post" validator={validatorClient} noValidate>
          <Container>
            <StrapiFormComponents components={form} />
          </Container>
          <Container>
            <ButtonNavigation
              back={{
                destination: backURL,
                label: common.backButton,
              }}
              next={{ label: nextButtonLabel ?? "" }}
            />
          </Container>
        </ValidatedForm>
      </div>
    </Background>
  );
}
