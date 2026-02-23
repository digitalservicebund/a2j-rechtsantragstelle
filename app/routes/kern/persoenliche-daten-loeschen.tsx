import { Form } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import KernButton from "~/components/kern/KernButton";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { type StrapiContentComponent } from "~/services/cms/models/formElements/StrapiContentComponent";
import { type Translations } from "~/services/translations/getTranslationByKey";

export default function KernPersoenlicheDatenLoeschen({
  content,
  isSubmitting,
  translations,
}: {
  content: StrapiContentComponent[];
  isSubmitting: boolean;
  translations: Translations;
}) {
  return (
    <div className="flex flex-col grow bg-kern-layout-background-hued">
      <ContentComponents content={content} showKernUX={true} />
      <GridSection className="pb-40">
        <Grid>
          <GridItem
            mdColumn={{ start: 1, span: 7 }}
            lgColumn={{ start: 3, span: 7 }}
            xlColumn={{ start: 3, span: 7 }}
            className="px-kern-space-default"
          >
            <Form method="post" action="/action/delete-data">
              <KernButton
                type="submit"
                look="primary"
                text={translations.confirm ?? "Ja, Daten löschen"}
                id="submitButton"
                disabled={isSubmitting}
              />
            </Form>
          </GridItem>
        </Grid>
      </GridSection>
    </div>
  );
}
