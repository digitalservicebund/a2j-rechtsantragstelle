import { ValidatedForm } from "@rvf/react-router";
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
} from "../beratungshilfe.zustaendiges-gericht.auswahl.$PLZ";

export default function KernZuestandigesGerichtPlz({ plz }: { plz: string }) {
  return (
    <GridSection className="bg-kern-layout-background-hued" pt="40" pb="40">
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
              text={`Im Bereich Ihrer Postleitzahl ${plz} sind
          verschiedene Amtsgerichte zuständig.`}
            />
            <h2 className="kern-body">
              Geben Sie bitte Ihre genaue Straße und Hausnummer ein
            </h2>
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
                    dataListArgument={plz}
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
                    width="10"
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
          <div className="flex justify-end w-full p-32 relative">
            <KernReportProblem />
          </div>
        </GridItem>
      </Grid>
    </GridSection>
  );
}
