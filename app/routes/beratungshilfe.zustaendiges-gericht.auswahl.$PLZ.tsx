import debounce from "lodash/debounce";
import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useFetcher, useLoaderData } from "react-router";
import AsyncSelect, { type SingleValue } from "react-select";
import Background from "~/components/Background";
import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import Container from "~/components/Container";
import CourtFinderHeader from "~/components/CourtFinderHeader";
import Heading from "~/components/Heading";
import CustomControl from "~/components/inputs/autoSuggestInput/customComponents/CustomControl";
import CustomInput from "~/components/inputs/autoSuggestInput/customComponents/CustomInput";
import RichText from "~/components/RichText";
import { fetchTranslations } from "~/services/cms/index.server";
import { type DataListOptions } from "~/services/dataListOptions/getDataListOptions";
import {
  edgeCaseStreets,
  fetchOpenPLZData,
} from "~/services/gerichtsfinder/amtsgerichtData.server";
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
  const [common] = await Promise.all([fetchTranslations("amtsgericht")]);

  const resultListHeading = applyStringReplacement(common.resultListHeading, {
    postcode: zipCode ?? "",
  });

  return {
    resultListHeading,
    openPlzResults: (await fetchOpenPLZData(zipCode)).map((result) => ({
      value: result.name.toLowerCase().replaceAll(/\s+/g, ""),
      label: result.name,
    })),
    pathname,
    common,
    url: `/beratungshilfe/zustaendiges-gericht/ergebnis/${zipCode}`,
  };
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const searchTerm = formData.get("searchTerm") as string;
  return data({
    openPlzResults: (
      await fetchOpenPLZData(params.PLZ ?? "", searchTerm?.toString() ?? "")
    ).map((result) => ({
      value: result.name.toLowerCase().replaceAll(/\s+/g, ""),
      label: result.name,
    })),
  });
};

export default function Index() {
  const { resultListHeading, pathname, openPlzResults, common, url } =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [selectedStreet, setSelectedStreet] =
    useState<SingleValue<DataListOptions>>();
  const [houseNumber, setHouseNumber] = useState<number>();

  const onInputChange = debounce((value: string) => {
    void fetcher.submit({ searchTerm: value }, { method: "POST" });
  }, 500);

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
            <AsyncSelect
              placeholder="Nach Straßenname suchen..."
              className="flex-grow"
              options={fetcher.data?.openPlzResults ?? openPlzResults}
              value={selectedStreet}
              onInputChange={onInputChange}
              onChange={(option) => setSelectedStreet(option)}
              components={{
                DropdownIndicator: null,
                Input: CustomInput,
                Control: CustomControl,
              }}
            />
            <input
              type="number"
              min={1}
              value={houseNumber}
              className="ds-input max-w-[25%]"
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
    </div>
  );
}

export function buildOpenPlzResultUrl(streetName: string, houseNumber: number) {
  return `${streetName
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replaceAll(/\s+/g, "_")}/${houseNumber}`;
}
