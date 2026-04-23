import type { LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, useNavigation } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import KernButton from "~/components/kern/KernButton";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import {
  fetchTranslations,
  strapiPageFromRequest,
} from "~/services/cms/index.server";
import { sanitizeReferrer } from "~/services/security/sanitizeReferrer";

export async function loader({ request }: LoaderFunctionArgs) {
  const { referrer } = request;
  const { origin } = new URL(request.url);

  const sanitizedReferrer = sanitizeReferrer({
    referrer,
    origin,
  });

  const { content, pageMeta } = await strapiPageFromRequest({ request });
  const translations = await fetchTranslations("delete-data");
  return {
    meta: pageMeta,
    content,
    translations,
    backButton: sanitizedReferrer,
  };
}

export default function PersoenlicheDatenLoeschen() {
  const { content, translations, backButton } = useLoaderData<typeof loader>();
  const isSubmitting = useNavigation().state === "submitting";

  return (
    <div className="flex flex-col grow bg-kern-layout-background-hued">
      <ContentComponents content={content} />
      <GridSection className="pb-40">
        <Grid>
          <GridItem
            mdColumn={{ start: 1, span: 7 }}
            lgColumn={{ start: 3, span: 7 }}
            xlColumn={{ start: 3, span: 7 }}
            className="px-kern-space-large lg:px-0"
          >
            <Form
              method="post"
              action="/action/delete-data"
              className="gap-kern-space-default flex flex-row"
            >
              <KernButton
                type="button"
                href={backButton}
                look="secondary"
                text={translations.back ?? "Zurück ohne zu löschen"}
              />
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
