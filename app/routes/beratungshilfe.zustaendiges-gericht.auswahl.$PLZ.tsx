import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { redirect, useFetcher, useLoaderData } from "react-router";
import Select, { type SingleValue } from "react-select";
import Background from "~/components/Background";
import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import Container from "~/components/Container";
import CourtFinderHeader from "~/components/CourtFinderHeader";
import Heading from "~/components/Heading";
import CustomControl from "~/components/inputs/autoSuggestInput/customComponents/CustomControl";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import RichText from "~/components/RichText";
import { fetchMeta, fetchTranslations } from "~/services/cms/index.server";
import { type DataListOptions } from "~/services/dataListOptions/getDataListOptions";
import { edgeCaseStreets } from "~/services/gerichtsfinder/amtsgerichtData.server";
import {
  fetchStreetnamesForZipcode,
  buildOpenPlzResultUrl,
} from "~/services/gerichtsfinder/openPLZ";
import { parseAndSanitizeMarkdown } from "~/services/security/markdownUtilities";
import { applyStringReplacement } from "~/util/applyStringReplacement";

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
    streetNameOptions: (await fetchStreetnamesForZipcode(zipCode)).map(
      (result) => ({
        value: result.name.toLowerCase().replaceAll(/\s+/g, ""),
        label: result.name,
      }),
    ),
    pathname,
    common,
    meta,
    url: `/beratungshilfe/zustaendiges-gericht/ergebnis/${zipCode}`,
  };
};

export default function Index() {
  const { resultListHeading, pathname, streetNameOptions, common, url } =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [selectedStreet, setSelectedStreet] =
    useState<SingleValue<DataListOptions>>();
  const [houseNumber, setHouseNumber] = useState<number>();

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
        <fetcher.Form method="post" action={pathname}>
          <div className="pb-16 flex gap-8">
            <Select
              placeholder="Nach Straßenname suchen..."
              className="flex-grow"
              options={fetcher.data?.streetNameOptions ?? streetNameOptions}
              value={selectedStreet}
              onChange={(option) => setSelectedStreet(option)}
              components={{
                DropdownIndicator: null,
                Control: CustomControl,
              }}
            />
            <input
              type="number"
              min={1}
              value={houseNumber}
              className="ds-input max-w-[25%]"
              alt="Hausnummer"
              required
              onChange={(e) => {
                const val = e.target.value;
                setHouseNumber(val.length > 0 ? parseInt(val) : undefined);
              }}
            />
          </div>
        </fetcher.Form>
        <ButtonContainer>
          <Button
            href="/beratungshilfe/zustaendiges-gericht/suche"
            look="tertiary"
            size="large"
            id="backLink"
          >
            {common.backButton}
          </Button>
          <Button
            href={`${url}/${buildOpenPlzResultUrl(selectedStreet?.label ?? "", houseNumber ?? 0)}`}
            size="large"
            disabled={!selectedStreet || !houseNumber}
            id="weiterButton"
          >
            Weiter
          </Button>
          <Button href={`${url}/default`} size="large" id="defaultButton">
            Ich finde meine Straße nicht
          </Button>
        </ButtonContainer>
      </Container>
      <ReportProblem />
    </div>
  );
}
