import {
  parseFormData,
  ValidatedForm,
  validationError,
} from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
import { z } from "zod";
import Button from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import Heading from "~/components/common/Heading";
import { type ErrorMessageProps } from "~/components/common/types";
import AutoSuggestInput from "~/components/formElements/AutoSuggestInput";
import Input from "~/components/formElements/Input";
import Container from "~/components/layout/Container";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import { edgeCaseStreets } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { buildOpenPlzResultUrl } from "~/services/gerichtsfinder/openPLZ";
import { createSessionWithCsrf } from "~/services/security/csrf/createSessionWithCsrf.server";
import { getSessionManager } from "~/services/session.server";
import { translations } from "~/services/translations/translations";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { filterFormData } from "~/util/filterFormData";

const requiredError: ErrorMessageProps = {
  code: "required",
  text: translations.gerichtFinder.inputRequired.de,
};

const courtFinderSchema = z.object({
  street: stringRequiredSchema,
  houseNumber: germanHouseNumberSchema,
});

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const zipCode = params.PLZ;
  if (zipCode === undefined)
    throw Error("Something went wrong, no zipcode found");
  const edgeCases = edgeCaseStreets({ zipCode });
  if (edgeCases.length == 0) {
    return redirect(`/beratungshilfe/zustaendiges-gericht/ergebnis/${zipCode}`);
  }

  const { session } = await createSessionWithCsrf(
    request.headers.get("Cookie"),
  );

  const sessionManager = getSessionManager("main");

  return data(
    {
      userData: { plz: zipCode },
      meta: { title: "Amtsgericht finden" },
    },
    { headers: { "Set-Cookie": await sessionManager.commitSession(session) } },
  );
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const relevantFormData = filterFormData(formData);
  const validationResult = await parseFormData(
    relevantFormData,
    courtFinderSchema,
  );
  const error = validationResult.error;
  if (error) {
    return validationError(error, validationResult.submittedData);
  }
  return redirect(
    `/beratungshilfe/zustaendiges-gericht/ergebnis/${params.PLZ}/${buildOpenPlzResultUrl(validationResult.data.street, validationResult.data.houseNumber)}`,
  );
};

export default function Index() {
  const { userData } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col grow bg-blue-100">
      <Container paddingTop="48" backgroundColor="blue">
        <span className="ds-label-03-reg">Amtsgericht finden</span>
        <Heading tagName="h1" look="ds-heading-02-reg" className="mt-16">
          Im Bereich Ihrer Postleitzahl <strong>{userData.plz}</strong> sind
          verschiedene Amtsgerichte zuständig.
        </Heading>
      </Container>
      <div className="grow">
        <Container paddingTop="48">
          <Heading
            tagName="h2"
            look="ds-heading-03-reg"
            text="Geben Sie bitte Ihre genaue Straße und Hausnummer ein"
            className="pb-16"
          />
          <ValidatedForm
            method="post"
            schema={courtFinderSchema}
            defaultValues={{ street: "", houseNumber: "" }}
          >
            <div className="ds-stack ds-stack-32">
              <div className="flex flex-wrap md:flex-nowrap gap-16">
                <AutoSuggestInput
                  label={translations.gerichtFinder.streetName.de}
                  dataList="streetNames"
                  dataListArgument={userData.plz}
                  noSuggestionMessage={
                    translations.gerichtFinder.noResultsFound.de
                  }
                  width="54"
                  errorMessages={[requiredError]}
                  name="street"
                  isDisabled={false}
                  minSuggestCharacters={0}
                />
                <Input
                  label={translations.gerichtFinder.houseNumber.de}
                  name="houseNumber"
                  errorMessages={[requiredError]}
                  width="10"
                />
              </div>
              <ButtonContainer>
                <Button
                  href="/beratungshilfe/zustaendiges-gericht/suche"
                  look="tertiary"
                  size="large"
                  text="Zurück"
                />
                <Button type="submit" size="large">
                  {translations.buttonNavigation.nextButtonDefaultLabel.de}
                </Button>
              </ButtonContainer>
            </div>
          </ValidatedForm>
        </Container>
      </div>
      <div className="flex justify-end w-full p-32 relative">
        <ReportProblem />
      </div>
    </div>
  );
}
