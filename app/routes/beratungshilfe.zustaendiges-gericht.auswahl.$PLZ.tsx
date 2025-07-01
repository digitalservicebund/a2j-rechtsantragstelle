import {
  parseFormData,
  ValidatedForm,
  validationError,
} from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
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
import { fetchMeta, fetchTranslations } from "~/services/cms/index.server";
import { edgeCaseStreets } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { buildOpenPlzResultUrl } from "~/services/gerichtsfinder/openPLZ";
import { parseAndSanitizeMarkdown } from "~/services/security/markdownUtilities";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import { filterFormData } from "~/util/filterFormData";

const courtFinderSchema = z.object({
  street: stringRequiredSchema,
  houseNumber: stringRequiredSchema,
});

const requiredError: ErrorMessageProps = {
  code: "required",
  text: "Bitte treffen Sie eine Auswahl.",
};

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
  const [common, meta] = await Promise.all([
    fetchTranslations("amtsgericht"),
    fetchMeta({ filterValue }),
  ]);

  const resultListHeading = parseAndSanitizeMarkdown(
    applyStringReplacement(common.resultListHeading, { postcode: zipCode }),
  );

  return {
    resultListHeading,
    prunedUserData: {
      plz: zipCode,
    },
    pathname,
    common,
    meta,
  };
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
  redirect(
    `beratungshilfe/zustaendiges-gericht/ergebnis/${params.PLZ}/${buildOpenPlzResultUrl(validationResult.data.street, parseInt(validationResult.data.houseNumber))}`,
  );
};

export default function Index() {
  const {
    resultListHeading,
    common,
    prunedUserData: { plz },
  } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col flex-grow">
      <Background backgroundColor="blue">
        <CourtFinderHeader label={common.featureName}>
          <RichText html={resultListHeading} />
        </CourtFinderHeader>
      </Background>
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
          <div className="pb-16 flex gap-8">
            <input hidden readOnly name={"_plz"} value={plz} />
            <AutoSuggestInput
              label="Straße"
              dataList="streetNames"
              noSuggestionMessage="Kein Eintrag gefunden"
              errorMessages={[requiredError]}
              name={"street"}
              isDisabled={false}
              minSuggestionCharacters={0}
            />
            <Input
              type="number"
              label="Hausnummer"
              name={"houseNumber"}
              errorMessages={[requiredError]}
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
              Weiter
            </Button>
          </ButtonContainer>
        </ValidatedForm>
      </Container>
      <ReportProblem />
    </div>
  );
}
