import type { DataFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ValidatedForm, validationError } from "remix-validated-form";
import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import Container from "~/components/Container";
import PageContent from "~/components/PageContent";
import Textarea from "~/components/Textarea";
import {
  feedbackFieldname,
  feedbackValidator,
} from "~/components/UserFeedback";
import { strapiPageFromRequest } from "~/services/cms/index.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") ?? "";
  const { content, meta } = await strapiPageFromRequest({ request });
  return json({ content, meta, url });
};

export const action = async ({ request }: DataFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") ?? "";
  console.log({ url });
  const result = await feedbackValidator.validate(await request.formData());
  if (result.error) return validationError(result.error, result.submittedData);
  return redirect(
    url ? `/feedback/erfolgreich?url=${url}` : "/feedback/erfolgreich",
  );
};

export default function Index() {
  const { url, content } = useLoaderData<typeof loader>();
  return (
    <div>
      <PageContent content={content} />
      <Container>
        <ValidatedForm validator={feedbackValidator} method="post">
          <div className="ds-stack-16">
            <Textarea name={feedbackFieldname} />
            <ButtonContainer>
              {url && (
                <Button look="tertiary" href={url}>
                  Zurück
                </Button>
              )}
              <Button look="primary" type="submit">
                Absenden
              </Button>
            </ButtonContainer>
          </div>
        </ValidatedForm>
      </Container>
    </div>
  );
}
