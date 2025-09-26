import {
  parseFormData,
  ValidatedForm,
  validationError,
} from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
import { z } from "zod";
import { BACKGROUND_COLORS } from "~/components";
import { ButtonNavigation } from "~/components/common/ButtonNavigation";
import Heading from "~/components/common/Heading";
import Input from "~/components/formElements/Input";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import { courtForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { getReturnToURL } from "~/services/routing/getReturnToURL";
import { getSessionManager } from "~/services/session.server";
import { postcodeSchema } from "~/services/validation/postcode";

const clientSchema = z.object({ postcode: postcodeSchema });

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionManager = getSessionManager("/beratungshilfe/vorabcheck");
  const { url: backURL, session } = getReturnToURL({
    request,
    session: await sessionManager.getSession(request.headers.get("Cookie")),
  });
  const headers = { "Set-Cookie": await sessionManager.commitSession(session) };

  return data(
    {
      backURL,
      meta: {
        title: "Amtsgericht finden",
        description:
          "Finden Sie schnell heraus, welches Amtsgericht bei Beratungshilfe für Sie zuständig ist.",
        ogTitle:
          "Beratungshilfe: Richtiges Amtsgericht finden | Justiz-Services",
        breadcrumb: "Amtsgericht finden",
      },
    },
    { headers },
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const serverSchema = clientSchema.refine(
    (postcodeObj) => courtForPlz(postcodeObj.postcode) !== undefined,
    { path: ["postcode"], message: "notFound" },
  );
  const result = await parseFormData(await request.formData(), serverSchema);
  if (result.error) return validationError(result.error, result.submittedData);
  const { pathname } = new URL(request.url);
  const urlStem = pathname.substring(0, pathname.lastIndexOf("/"));
  return redirect(`${urlStem}/ergebnis/${result.data?.postcode}`);
}

export default function Index() {
  const { backURL } = useLoaderData<typeof loader>();

  return (
    <GridSection backgroundClass={BACKGROUND_COLORS.blue} pt="40" pb="40">
      <Grid>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
        >
          <div className="ds-stack ds-stack-32">
            <Heading
              tagName="h1"
              look="ds-label-02-reg"
              text="Zuständiges Amtsgericht finden"
            />
            <Heading
              tagName="h2"
              look="ds-heading-02-reg"
              text="Wie ist Ihre Postleitzahl"
            />
            <p>
              Bitte geben Sie die Postleitzahl Ihres Wohnsitzes ein. Wir zeigen
              Ihnen dann die Adresse Ihres Amtsgerichts und wie Sie mit dem
              Gericht in Kontakt treten können.
            </p>

            <ValidatedForm
              method="post"
              schema={clientSchema}
              defaultValues={{ postcode: "" }}
              noValidate
            >
              <div className="ds-stack ds-stack-32">
                <Input
                  name="postcode"
                  label="Postleitzahl"
                  type="number"
                  width="10"
                  errorMessages={[
                    {
                      code: "length",
                      text: "Postleitzahl muss genau 5 Zeichen lang sein",
                    },
                    { code: "invalid", text: "Ungültige Postleitzahl" },
                    {
                      code: "notFound",
                      text: "Postleitzahl existiert nicht",
                    },
                  ]}
                />
                <ButtonNavigation
                  back={{ destination: backURL, label: "Zurück" }}
                  next={{ label: "Weiter" }}
                />
              </div>
            </ValidatedForm>
          </div>
        </GridItem>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 7, span: 5 }}
          xlColumn={{ start: 7, span: 5 }}
          className="pb-40 flex justify-end"
          row={2}
        >
          <ReportProblem />
        </GridItem>
      </Grid>
    </GridSection>
  );
}
