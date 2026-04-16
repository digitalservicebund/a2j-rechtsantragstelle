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
import { createSessionWithCsrf } from "~/services/security/csrf/createSessionWithCsrf.server";
import { getSessionManager } from "~/services/session.server";
import { translations } from "~/services/translations/translations";
import { germanHouseNumberSchema } from "~/services/validation/germanHouseNumber";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { filterFormData } from "~/util/filterFormData";
import { GridSection } from "~/components/layout/grid/GridSection";
import { KernAutoSuggestInput } from "~/components/kern/formElements/autoSuggest";
import NumberInput from "~/components/kern/formElements/input/NumberInput";
import KernButton from "~/components/kern/KernButton";
import KernButtonContainer from "~/components/kern/KernButtonContainer";
import KernHeading from "~/components/kern/KernHeading";
import { KernReportProblem } from "~/components/kern/KernReportProblem";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";

export const requiredError: ErrorMessageProps = {
  code: "required",
  text: translations.gerichtFinder.inputRequired.de,
};

export const courtFinderSchema = z.object({
  street: stringRequiredSchema,
  houseNumber: germanHouseNumberSchema,
});

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const zipCode = params.PLZ;
  if (zipCode === undefined)
    throw new Error("Something went wrong, no zipcode found");
  const edgeCases = edgeCasesForPlz(zipCode);
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
    { headers: await sessionManager.commitSession(session) },
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
              Amtsgericht finden
            </span>
            <KernHeading
              tagName="h1"
              text={`Im Bereich Ihrer Postleitzahl ${userData.plz} sind
          verschiedene Amtsgerichte zuständig.`}
              managedByParent
            />
            <p className="kern-body">
              Geben Sie bitte Ihre genaue Straße und Hausnummer ein
            </p>
            <ValidatedForm
              method="post"
              schema={courtFinderSchema}
              defaultValues={{ street: "", houseNumber: "" }}
            >
              <div className="gap-kern-space-x-large flex flex-col">
                <div className="flex flex-col gap-kern-space-x-large">
                  <KernAutoSuggestInput
                    label={translations.gerichtFinder.streetName.de}
                    helperText={
                      translations.gerichtFinder.autosuggestInputHelperText.de
                    }
                    dataList="streetNames"
                    dataListArgument={userData.plz}
                    noSuggestionMessage={
                      translations.gerichtFinder.noResultsFound.de
                    }
                    errorMessages={[requiredError]}
                    name="street"
                    isDisabled={false}
                    minSuggestCharacters={0}
                  />
                  <NumberInput
                    label={translations.gerichtFinder.houseNumber.de}
                    name="houseNumber"
                    errorMessages={[requiredError]}
                  />
                </div>
                <KernButtonContainer>
                  <KernButton
                    href="/beratungshilfe/zustaendiges-gericht/suche"
                    look="secondary"
                    text="Zurück"
                  />
                  <KernButton type="submit">
                    {translations.buttonNavigation.nextButtonDefaultLabel.de}
                  </KernButton>
                </KernButtonContainer>
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
          <KernReportProblem />
        </GridItem>
      </Grid>
    </GridSection>
  );
}
