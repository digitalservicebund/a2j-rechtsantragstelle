import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import Container from "~/components/Container";
import PageContent from "~/components/PageContent";
import {
  fetchTranslations,
  strapiPageFromRequest,
} from "~/services/cms/index.server";
import { StrapiContentComponent } from "~/services/cms/models/StrapiContentComponent";
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
    <>
      <PageContent content={content as StrapiContentComponent[]} />
      <Container paddingTop="0">
        <Form
          method="post"
          className="ds-stack-24"
          action="/action/delete-data"
        >
          <ButtonContainer>
            <Button
              type="button"
              href={backButton}
              look="tertiary"
              size="large"
              text={translations.back ?? "Zurück ohne zu löschen"}
            />
            <Button
              type="submit"
              look="primary"
              size="large"
              text={translations.confirm ?? "Ja, Daten löschen"}
              id="submitButton"
              disabled={isSubmitting}
            />
          </ButtonContainer>
        </Form>
      </Container>
    </>
  );
}
