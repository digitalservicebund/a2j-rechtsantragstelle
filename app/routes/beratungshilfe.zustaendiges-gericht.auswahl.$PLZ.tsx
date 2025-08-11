import {
  parseFormData,
  ValidatedForm,
  validationError,
} from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
import { z } from "zod";
import Background from "~/components/Background";
import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import Container from "~/components/Container";
import CourtFinderHeader from "~/components/CourtFinderHeader";
import Heading from "~/components/Heading";
import { type ErrorMessageProps } from "~/components/inputs";
import AutoSuggestInput from "~/components/inputs/autoSuggestInput/AutoSuggestInput";
import Input from "~/components/inputs/Input";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import RichText from "~/components/RichText";
import { streetHouseNumberSchema } from "~/domains/shared/formular/persoenlicheDaten/userData";
import { fetchMeta, fetchTranslations } from "~/services/cms/index.server";
import { edgeCaseStreets } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { buildOpenPlzResultUrl } from "~/services/gerichtsfinder/openPLZ";
import { createSessionWithCsrf } from "~/services/security/csrf/createSessionWithCsrf.server";
import { parseAndSanitizeMarkdown } from "~/services/security/markdownUtilities";
import { getSessionManager } from "~/services/session.server";
import { translations } from "~/services/translations/translations";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import { filterFormData } from "~/util/filterFormData";

const requiredError: ErrorMessageProps = {
  code: "required",
  text: translations.gerichtFinder.inputRequired.de,
};

const courtFinderSchema = z.object(streetHouseNumberSchema);

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const zipCode = params.PLZ;
  if (zipCode === undefined)
    throw Error("Something went wrong, no zipcode found");
  const edgeCases = edgeCaseStreets({ zipCode });
  if (edgeCases.length == 0) {
    return redirect(`/beratungshilfe/zustaendiges-gericht/ergebnis/${zipCode}`);
  }

  // Remove PLZ from slug
  const { pathname } = new URL(request.url);
  const filterValue = pathname.substring(0, pathname.lastIndexOf("/"));
  const [common, meta, { session }] = await Promise.all([
    fetchTranslations("amtsgericht"),
    fetchMeta({ filterValue }),
    createSessionWithCsrf(request.headers.get("Cookie")),
  ]);

  const sessionManager = getSessionManager("main");

  const resultListHeading = parseAndSanitizeMarkdown(
    applyStringReplacement(common.resultListHeading, { postcode: zipCode }),
  );

  return data(
    {
      resultListHeading,
      prunedUserData: {
        plz: zipCode,
      },
      pathname,
      common,
      meta,
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
  const { resultListHeading, common } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col grow bg-blue-100">
      <Background backgroundColor="blue">
        <CourtFinderHeader label={common.featureName}>
          <RichText html={resultListHeading} />
        </CourtFinderHeader>
      </Background>
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
            defaultValues={{
              street: "",
              houseNumber: "",
            }}
          >
            <div className="ds-stack ds-stack-32">
              <div className="flex flex-wrap md:flex-nowrap gap-16">
                <AutoSuggestInput
                  label={translations.gerichtFinder.streetName.de}
                  dataList="streetNames"
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
                  id="backLink"
                >
                  {common.backButton}
                </Button>
                <Button type="submit" size="large" id="weiterButton">
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
