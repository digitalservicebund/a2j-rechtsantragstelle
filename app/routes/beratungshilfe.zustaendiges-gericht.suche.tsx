import {
  parseFormData,
  ValidatedForm,
  validationError,
} from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
import { z } from "zod";
import Background from "~/components/Background";
import Container from "~/components/Container";
import ContentComponents from "~/components/ContentComponents";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import { FormComponents } from "~/components/FormComponents";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import type { FlowId } from "~/domains/flowIds";
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

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionManager = getSessionManager("/beratungshilfe/vorabcheck");

  const [common, { pre_form, form, pageMeta, nextButtonLabel }] =
    await Promise.all([
      fetchTranslations("amtsgericht"),
      fetchFlowPage(
        "vorab-check-pages",
        "/beratungshilfe/zustaendiges-gericht" as FlowId,
        "/suche",
      ),
    ]);
  const { url: backURL, session } = getReturnToURL({
    request,
    session: await sessionManager.getSession(request.headers.get("Cookie")),
  });
  const headers = { "Set-Cookie": await sessionManager.commitSession(session) };
  return data(
    { common, pre_form, form, meta: pageMeta, backURL, nextButtonLabel },
    { headers },
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const result = await parseFormData(await request.formData(), serverSchema);
  if (result.error) return validationError(result.error, result.submittedData);
  const { pathname } = new URL(request.url);
  const urlStem = pathname.substring(0, pathname.lastIndexOf("/"));
  return redirect(`${urlStem}/ergebnis/${result.data?.postcode}`);
}

export default function Index() {
  const { common, pre_form, form, backURL, nextButtonLabel } =
    useLoaderData<typeof loader>();

  return (
    <Background backgroundColor="blue">
      <div className="flex flex-col min-w-[100vw] h-full pb-32">
        <div className="flex-grow">
          <Container>
            <div className="ds-stack ds-stack-32">
              <ContentComponents
                className="ds-stack ds-stack-16"
                content={pre_form}
              />
              <ValidatedForm
                method="post"
                schema={clientSchema}
                defaultValues={{ postcode: "" }}
                noValidate
              >
                <div className="ds-stack ds-stack-32">
                  <FormComponents components={form} />
                  <ButtonNavigation
                    back={{
                      destination: backURL,
                      label: common.backButton,
                    }}
                    next={{ label: nextButtonLabel ?? "" }}
                  />
                </div>
              </ValidatedForm>
            </div>
          </Container>
        </div>
        <div className="self-end mr-32">
          <ReportProblem />
        </div>
      </div>
    </Background>
  );
}
