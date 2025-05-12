import debounce from "lodash/debounce";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useFetcher, useLoaderData } from "react-router";
import AsyncSelect from "react-select";
import Background from "~/components/Background";
import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import Container from "~/components/Container";
import CourtFinderHeader from "~/components/CourtFinderHeader";
import Heading from "~/components/Heading";
import RichText from "~/components/RichText";
import { fetchMeta, fetchTranslations } from "~/services/cms/index.server";
import {
  edgeCaseStreets,
  fetchOpenPLZData,
} from "~/services/gerichtsfinder/amtsgerichtData.server";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import { splitObjectsByFirstLetter } from "~/util/strings";

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
    edgeCasesGroupedByLetter: splitObjectsByFirstLetter(edgeCases, "street"),
    common,
    meta,
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
  const {
    resultListHeading,
    pathname,
    openPlzResults,
    edgeCasesGroupedByLetter,
    common,
    url,
  } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

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
          text={common.resultListSubHeading}
        />
        <ul className="list-none pl-0 pt-48 pb-32" id="resultList">
          {edgeCasesGroupedByLetter &&
            Object.entries(edgeCasesGroupedByLetter).map(
              ([firstLetter, edgeCasesForLetter]) => (
                <li key={firstLetter}>
                  <h2 className="ds-label-01-bold p-8 bg-blue-100">
                    {firstLetter}
                  </h2>
                  <ul className="list-none py-10 pl-0">
                    {edgeCasesForLetter.map((edgeCase) => (
                      <li key={edgeCase.slug} className="px-8">
                        <a
                          href={`${url}/${edgeCase.slug}`}
                          className="leading-9 underline"
                        >
                          {edgeCase.street}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ),
            )}
        </ul>
        <Container>
          <fetcher.Form method="post" action={pathname}>
            <AsyncSelect
              placeholder="Tippen..."
              options={fetcher.data?.openPlzResults ?? openPlzResults}
              onInputChange={onInputChange}
              components={{ DropdownIndicator: null, LoadingMessage }}
            />
          </fetcher.Form>
        </Container>
        <ButtonContainer>
          <Button
            href="/beratungshilfe/zustaendiges-gericht/suche"
            look="tertiary"
            size="large"
            id="backLink"
          >
            {common.backButton}
          </Button>
          <Button href={`${url}/default`} size="large" id="defaultButton">
            {common.continueWithDefaultStreet}
          </Button>
        </ButtonContainer>
      </Container>
    </div>
  );
}

function LoadingMessage() {
  return <p>Loading...</p>;
}
