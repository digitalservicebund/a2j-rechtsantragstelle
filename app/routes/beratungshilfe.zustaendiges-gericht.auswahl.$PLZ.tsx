import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Background, Button, Container } from "~/components";
import ButtonContainer from "~/components/ButtonContainer";
import CourtFinderHeader from "~/components/CourtFinderHeader";
import { getStrapiAmtsgerichtCommon, getStrapiPage } from "~/services/cms";
import { edgeCaseStreets } from "~/services/gerichtsfinder/amtsgerichtData.server";
import RichText from "~/components/RichText";
import { fillTemplate } from "~/util/fillTemplate";
import Heading from "~/components/Heading";
import { splitObjectsByFirstLetter } from "~/util/strings";

export const meta: V2_MetaFunction<typeof loader> = ({ location, data }) => [
  { title: data?.meta.title ?? location.pathname },
];

export const loader = async ({ params, request }: LoaderArgs) => {
  const zipCode = params.PLZ;
  const edgeCases = edgeCaseStreets({ zipCode });
  if (edgeCases.length == 0) {
    return redirect(`/beratungshilfe/zustaendiges-gericht/ergebnis/${zipCode}`);
  }

  // Remove PLZ from slug
  const { pathname } = new URL(request.url);
  const slug = pathname.substring(0, pathname.lastIndexOf("/"));
  const common = await getStrapiAmtsgerichtCommon();
  const resultListHeading = fillTemplate({
    template: common.resultListHeading,
    replacements: { postcode: zipCode ?? "" },
  });

  return json({
    resultListHeading,
    edgeCasesGroupedByLetter: splitObjectsByFirstLetter(edgeCases, "street"),
    common,
    meta: (await getStrapiPage({ slug })).meta,
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
