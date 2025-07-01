import { ValidatedForm } from "@rvf/react-router";
import type { LoaderFunctionArgs } from "react-router";
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
import { parseAndSanitizeMarkdown } from "~/services/security/markdownUtilities";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { applyStringReplacement } from "~/util/applyStringReplacement";

export const courtFinderSchema = z.object({
  strasse: stringRequiredSchema,
  hausnummer: stringRequiredSchema,
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
    url: `/beratungshilfe/zustaendiges-gericht/ergebnis/${zipCode}`,
  };
};

export default function Index() {
  const { resultListHeading, common, url } = useLoaderData<typeof loader>();

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
          action={url}
          schema={courtFinderSchema}
          defaultValues={{ strasse: "", hausnummer: "" }}
        >
          <div className="pb-16 flex gap-8">
            <AutoSuggestInput
              label="Straße"
              dataList="streetNames"
              noSuggestionMessage="Kein Eintrag gefunden"
              errorMessages={[requiredError]}
              name={"strasse"}
              isDisabled={false}
              minSuggestionCharacters={0}
            />
            <Input
              type="number"
              label="Hausnummer"
              name={"hausnummer"}
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
