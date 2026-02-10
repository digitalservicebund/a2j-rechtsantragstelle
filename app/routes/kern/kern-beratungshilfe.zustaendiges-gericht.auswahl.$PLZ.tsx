import { ValidatedForm } from "@rvf/react";
import { useLoaderData } from "react-router";
import { KernAutoSuggestInput } from "~/components/kern/formElements/autoSuggest";
import NumberInput from "~/components/kern/formElements/input/NumberInput";
import KernButton from "~/components/kern/KernButton";
import KernButtonContainer from "~/components/kern/KernButtonContainer";
import KernHeading from "~/components/kern/KernHeading";
import { KernReportProblem } from "~/components/kern/KernReportProblem";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { translations } from "~/services/translations/translations";
import {
  courtFinderSchema,
  requiredError,
  type loader,
} from "../beratungshilfe.zustaendiges-gericht.auswahl.$PLZ";

export default function KernZuestandigesGerichtPlz() {
  const { userData } = useLoaderData<typeof loader>();

  return (
    <GridSection pt="40" pb="40">
      <Grid>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
        >
          <div className="gap-kern-space-x-large flex flex-col">
            <span className="kern-text text-l! mt-16">Amtsgericht finden</span>
            <KernHeading
              tagName="h1"
              className="mt-16 text-3xl!"
              text={`Im Bereich Ihrer Postleitzahl ${userData.plz} sind
          verschiedene Amtsgerichte zuständig.`}
            />
          </div>
          <div>
            <KernHeading
              tagName="h2"
              text="Geben Sie bitte Ihre genaue Straße und Hausnummer ein"
              className="pb-16 pt-16! text-lg! font-normal!"
            />
            <ValidatedForm
              method="post"
              schema={courtFinderSchema}
              defaultValues={{ street: "", houseNumber: "" }}
            >
              <div className="gap-kern-space-x-large flex flex-col">
                <div className="flex flex-wrap md:flex-nowrap gap-16">
                  <div className="flex flex-col">
                    <KernAutoSuggestInput
                      label={translations.gerichtFinder.streetName.de}
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
                    <div className="label-text mt-6">
                      {translations.gerichtFinder.autosuggestInputHelperText.de}
                    </div>
                    <NumberInput
                      label={translations.gerichtFinder.houseNumber.de}
                      name="houseNumber"
                      errorMessages={[requiredError]}
                      width="10"
                    />
                  </div>
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
          <div className="flex justify-end w-full p-32 relative">
            <KernReportProblem />
          </div>
        </GridItem>
      </Grid>
    </GridSection>
  );
}
