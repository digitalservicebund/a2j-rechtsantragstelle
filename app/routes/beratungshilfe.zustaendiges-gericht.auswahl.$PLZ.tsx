import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Background from "~/components/Background";
import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import Container from "~/components/Container";
import CourtFinderHeader from "~/components/CourtFinderHeader";
import Heading from "~/components/Heading";
import RichText from "~/components/RichText";
import { fetchMeta, fetchTranslations } from "~/services/cms/index.server";
import { edgeCaseStreets } from "~/services/gerichtsfinder/amtsgerichtData.server";
import { fillTemplate } from "~/util/fillTemplate";
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

  const resultListHeading = fillTemplate({
    template: common.resultListHeading,
    replacements: { postcode: zipCode ?? "" },
  });

  return json({
    resultListHeading,
    edgeCasesGroupedByLetter: splitObjectsByFirstLetter(edgeCases, "street"),
    common,
    meta,
    url: `/beratungshilfe/zustaendiges-gericht/ergebnis/${zipCode}`,
  });
};

export default function Index() {
  const { resultListHeading, edgeCasesGroupedByLetter, common, url } =
    useLoaderData<typeof loader>();

  return (
    <>
      <Background backgroundColor="blue">
        <CourtFinderHeader label={common.featureName}>
          <RichText markdown={resultListHeading} />
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
    </>
  );
}
