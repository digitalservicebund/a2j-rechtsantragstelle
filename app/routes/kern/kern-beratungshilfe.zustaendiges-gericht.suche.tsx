import {
  parseFormData,
  ValidatedForm,
  validationError,
} from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
import { z } from "zod";
import NumberInput from "~/components/kern/formElements/input/NumberInput";
import { KernButtonNavigation } from "~/components/kern/KernButtonNavigation";
import KernHeading from "~/components/kern/KernHeading";
import { KernReportProblem } from "~/components/kern/KernReportProblem";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
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
export default function KernZuestandigesGerichtSuche() {
  const { backURL } = useLoaderData<typeof loader>();

  return (
    <GridSection pt="40" pb="40">
      <Grid>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
        >
          <div className="gap-kern-space-x-large flex flex-col">
            <KernHeading tagName="h1" text="Zuständiges Amtsgericht finden" className="text-lg!" />
            <KernHeading tagName="h2" text="Wie ist Ihre Postleitzahl" className="text-3xl!" />
            <p className="kern-text">
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
              <div>
                <NumberInput
                  name="postcode"
                  label="Postleitzahl"
                  type="number"
                  width="16"
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
                <KernButtonNavigation
                  back={{ destination: backURL, label: "Zurück" }}
                  next={{ label: "Weiter" }}
                />
              </div>
            </ValidatedForm>
          </div>
        </GridItem>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 1, span: 12 }}
          xlColumn={{ start: 1, span: 12 }}
          className="pb-40 flex justify-end"
          row={2}
        >
          <KernReportProblem />
        </GridItem>
      </Grid>
    </GridSection>
  );
}
