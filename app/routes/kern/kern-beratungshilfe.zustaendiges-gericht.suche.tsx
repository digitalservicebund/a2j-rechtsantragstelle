import { ValidatedForm } from "@rvf/react-router";
import { z } from "zod";
import NumberInput from "~/components/kern/formElements/input/NumberInput";
import { KernButtonNavigation } from "~/components/kern/KernButtonNavigation";
import KernHeading from "~/components/kern/KernHeading";
import { KernReportProblem } from "~/components/kern/KernReportProblem";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { postcodeSchema } from "~/services/validation/postcode";

const clientSchema = z.object({ postcode: postcodeSchema });

export default function KernZuestandigesGerichtSuche({ backURL }: { backURL: string | undefined }) {

  return (
    <GridSection className="bg-kern-layout-background-hued" pt="40" pb="40">
      <Grid>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
        >
          <div className="gap-kern-space-x-large flex flex-col">
            <KernHeading
              tagName="h1"
              text="Zuständiges Amtsgericht finden"
              className="text-lg! text-kern-layout-text-muted!"
            />
            <KernHeading
              tagName="h2"
              text="Wie ist Ihre Postleitzahl"
              size="large"
            />
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
