import {
  parseFormData,
  ValidatedForm,
  validationError,
} from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData } from "react-router";
import { z } from "zod";
import { type ErrorMessageProps } from "~/components/common/types";
import { edgeCasesForPlz } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { filterFormData } from "~/util/filterFormData";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import AutoSuggestInput from "~/components/formElements/inputs/autoSuggest/AutoSuggestInput";
import NumberInput from "~/components/formElements/inputs/number/NumberInput";
import Button from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import Heading from "~/components/common/Heading";
import { ReportProblem } from "~/components/content/reportProblem/ReportProblem";
import { commonTranslations } from "~/services/translations/common";
import { gerichtFinderTranslations } from "~/services/translations/domains/gerichtFinder";

export const requiredError: ErrorMessageProps = {
  code: "required",
  text: gerichtFinderTranslations.gerichtFinder.inputRequired.de,
};

export const courtFinderSchema = z.object({
  street: stringRequiredSchema,
  houseNumber: germanHouseNumberSchema,
});

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const zipCode = params.PLZ;
  if (zipCode === undefined)
    throw new Error("Something went wrong, no zipcode found");
  const edgeCases = edgeCasesForPlz(zipCode);
  if (edgeCases.length == 0) {
    return redirect(`/beratungshilfe/zustaendiges-gericht/ergebnis/${zipCode}`);
  }

  return data({
    userData: { plz: zipCode },
    meta: { title: "Amtsgericht finden" },
  });
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
    `/beratungshilfe/zustaendiges-gericht/ergebnis/${params.PLZ}/${encodeURIComponent(validationResult.data.street)}/${encodeURIComponent(validationResult.data.houseNumber)}`,
  );
};

export default function Index() {
  const { userData } = useLoaderData<typeof loader>();

  return (
    <GridSection className="bg-kern-layout-background-hued" pt="40" pb="40">
      <Grid>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
        >
          <div className="gap-kern-space-x-large flex flex-col">
            <span className="text-kern-static-medium text-kern-layout-text-muted!">
              {gerichtFinderTranslations.gerichtFinder.finder.de}
            </span>
            <Heading
              tagName="h1"
              text={`Im Bereich Ihrer Postleitzahl ${userData.plz} sind
          verschiedene Amtsgerichte zuständig.`}
              managedByParent
            />
            <p className="kern-body">
              {gerichtFinderTranslations.gerichtFinder.addressHelperText.de}
            </p>
            <ValidatedForm
              method="post"
              schema={courtFinderSchema}
              defaultValues={{ street: "", houseNumber: "" }}
            >
              <div className="gap-kern-space-x-large flex flex-col">
                <div className="flex flex-col gap-kern-space-x-large">
                  <AutoSuggestInput
                    label={commonTranslations.common.street.de}
                    helperText={
                      gerichtFinderTranslations.gerichtFinder
                        .autosuggestInputHelperText.de
                    }
                    dataList="streetNames"
                    dataListArgument={userData.plz}
                    noSuggestionMessage={
                      gerichtFinderTranslations.gerichtFinder.noResultsFound.de
                    }
                    errorMessages={[requiredError]}
                    name="street"
                    isDisabled={false}
                    minSuggestCharacters={0}
                  />
                  <NumberInput
                    label={commonTranslations.common.housenumber.de}
                    name="houseNumber"
                    errorMessages={[requiredError]}
                  />
                </div>
                <ButtonContainer>
                  <Button
                    href="/beratungshilfe/zustaendiges-gericht/suche"
                    look="secondary"
                    text={commonTranslations.common.back.de}
                  />
                  <Button type="submit">
                    {commonTranslations.common.next.de}
                  </Button>
                </ButtonContainer>
              </div>
            </ValidatedForm>
          </div>
        </GridItem>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 1, span: 12 }}
          xlColumn={{ start: 1, span: 12 }}
          className="pb-40 pt-kern-space-x-large flex justify-end"
          row={4}
        >
          <ReportProblem />
        </GridItem>
      </Grid>
    </GridSection>
  );
}
