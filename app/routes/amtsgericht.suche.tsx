import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Background, Button, Container, Input } from "~/components";
import ButtonContainer from "~/components/ButtonContainer";
import { courtForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { ValidatedForm, validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { getStrapiAmtsgerichtCommon } from "~/services/cms";
import CourtFinderHeader from "~/components/CourtFinderHeader";

function isValidPostcode(postcode: string) {
  const postcodeNum = parseInt(postcode, 10);
  return postcodeNum >= 1067 && postcodeNum <= 99998;
}

const clientSchema = z.object({
  postcode: z
    .string()
    .length(5)
    .refine((postcode) => isValidPostcode(postcode)),
});

const serverSchema = clientSchema.refine(
  (postcodeObj) => courtForPlz(postcodeObj.postcode) !== undefined,
  { path: ["postcode"] }
);

const validatorClient = withZod(clientSchema);
const validatorServer = withZod(serverSchema);

export async function loader() {
  const common = await getStrapiAmtsgerichtCommon();
  return json({ common });
}

export async function action({ request }: ActionArgs) {
  const result = await validatorServer.validate(await request.formData());
  if (result.error) return validationError(result.error);
  return redirect(`../amtsgericht/ergebnis/${result.data?.postcode}`);
}

export default function Index() {
  const { common } = useLoaderData<typeof loader>();
  return (
    <Background backgroundColor="blue">
      <CourtFinderHeader label={common.featureName}>
        {common.searchHeading}
      </CourtFinderHeader>

      <ValidatedForm method="post" validator={validatorClient} noValidate>
        <Container>
          <Input
            name="postcode"
            type="text"
            label="Postleitzahl"
            placeholder="12345"
          />
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
