import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { Background, Button, Container, Input } from "~/components";
import ButtonContainer from "~/components/ButtonContainer";
import { courtForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { getStrapiAmtsgerichtCommon } from "~/services/cms";
import CourtFinderHeader from "~/components/CourtFinderHeader";

function isValidPostcode(postcode: string) {
  const postcodeNum = parseInt(postcode, 10);
  return postcodeNum >= 1067 && postcodeNum <= 99998;
}

const postcodeValidator = withZod(
  z.object({
    postcode: z
      .string()
      .length(5, {
        message: "Ungültige Postleitzahl",
      })
      .refine((postcode) => isValidPostcode(postcode), {
        message: "Ungültige Postleitzahl",
      }),
  })
);

export async function loader() {
  const common = await getStrapiAmtsgerichtCommon();
  return json({ common });
}

export async function action({ request }: ActionArgs) {
  const validatedFormInput = await postcodeValidator.validate(
    await request.formData()
  );

  let errorMessage =
    validatedFormInput.error?.fieldErrors.postcode ??
    !courtForPlz(validatedFormInput.data?.postcode)
      ? "Postleitzahl nicht gefunden"
      : "";

  if (errorMessage == "") {
    return redirect(
      `../amtsgericht/ergebnis/${validatedFormInput.data?.postcode}`
    );
  }
  return json({ errorMessage });
}

export default function Index() {
  const { common } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  return (
    <Background backgroundColor="blue">
      <CourtFinderHeader label={common.featureName}>
        {common.searchHeading}
      </CourtFinderHeader>

      <ValidatedForm method="post" validator={postcodeValidator} noValidate>
        <Container>
          <Input
            name="postcode"
            type="text"
            label="Postleitzahl"
            placeholder="12345"
          />
          {actionData?.errorMessage}
        </Container>
        <Container>
          <ButtonContainer>
            <Button href="#" look="tertiary" size="large">
              Zurück
            </Button>
            <Button type="submit" size="large" id="submitButton">
              Übernehmen & Weiter
            </Button>
          </ButtonContainer>
        </Container>
      </ValidatedForm>
    </Background>
  );
}
