import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import Container from "~/components/Container";
import PageContent from "~/components/PageContent";
import {
  fetchTranslations,
  strapiPageFromRequest,
} from "~/services/cms/index.server";
import { sanitizeReferrer } from "~/services/security/sanitizeReferrer";

export async function loader({ request }: LoaderFunctionArgs) {
  const { content, meta } = await strapiPageFromRequest({ request });
  const translations = await fetchTranslations("delete-data");
  return { meta, content, translations };
}

export default function Index() {
  const { content, translations } = useLoaderData<typeof loader>();
  const isSubmitting = useNavigation().state === "submitting";
  const [previousPage, setPreviousPage] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    setPreviousPage(
      sanitizeReferrer(document.referrer, window.location.origin),
    );
  }, []);

  return (
    <>
      <PageContent content={content} />
      <Container paddingTop="0">
        <Form
          method="post"
          className="ds-stack-24"
          action="/action/delete-data"
        >
          <ButtonContainer>
            <Button
              type="button"
              href={previousPage}
              look="tertiary"
              size="large"
              text={translations["back"] ?? "Zurück ohne zu löschen"}
            />
            <Button
              type="submit"
              look="primary"
              size="large"
              text={translations["confirm"] ?? "Ja, Daten löschen"}
              id="submitButton"
              disabled={isSubmitting}
            />
          </ButtonContainer>
        </Form>
      </Container>
    </>
  );
}
