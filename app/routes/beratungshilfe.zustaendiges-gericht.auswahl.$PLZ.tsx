import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Background, Button, Container } from "~/components";
import ButtonContainer from "~/components/ButtonContainer";
import CourtFinderHeader from "~/components/CourtFinderHeader";
import { getStrapiAmtsgerichtCommon, getStrapiPage } from "~/services/cms";
import { findEdgeCases } from "~/services/gerichtsfinder/amtsgerichtData.server";
import RichText from "~/components/RichText";
import { fillTemplate } from "~/util/fillTemplate";

export const meta: V2_MetaFunction<typeof loader> = ({ location, data }) => [
  { title: data ? data.metaData.title : location.pathname },
];

export const loader = async ({ params }: LoaderArgs) => {
  const zipCode = params.PLZ;
  const edgeCases = findEdgeCases({ zipCode });
  if (edgeCases.length == 0) {
    return redirect(`/beratungshilfe/zustaendiges-gericht/${zipCode}`);
  }

  const edgeCasesGroupedByLetter = edgeCases.reduce(
    (acc: { [x: string]: ReturnType<typeof findEdgeCases> }, edgeCase) => {
      (acc[edgeCase.STRN[0]] = acc[edgeCase.STRN[0]] ?? []).push(edgeCase);
      return acc;
    },
    {}
  );

  const cmsData = await getStrapiPage({
    slug: "beratungshilfe/zustaendiges-gericht/auswahl",
  });
  const common = await getStrapiAmtsgerichtCommon();

  return json({
    zipCode,
    edgeCasesGroupedByLetter,
    common,
    metaData: cmsData.meta,
    url: `/beratungshilfe/zustaendiges-gericht/ergebnis/${zipCode}`,
  });
};

export default function Index() {
  const { zipCode, edgeCasesGroupedByLetter, common, url } =
    useLoaderData<typeof loader>();

  return (
    <>
      <Background backgroundColor="blue">
        <CourtFinderHeader label={common.featureName}>
          <RichText
            markdown={fillTemplate({
              template: common.resultListHeading,
              replacements: { postcode: zipCode ?? "" },
            })}
          />
        </CourtFinderHeader>
      </Background>
      <Container paddingTop="48">
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
                      <li key={edgeCase.streetSlug}>
                        <div>
                          <a
                            href={`${url}/${edgeCase.streetSlug}`}
                            className="leading-9 underline"
                          >
                            {edgeCase.street}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              )
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
