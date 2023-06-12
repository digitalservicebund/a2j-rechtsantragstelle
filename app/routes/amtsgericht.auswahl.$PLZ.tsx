import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Background, Button, Container } from "~/components";
import ButtonContainer from "~/components/ButtonContainer";
import CourtFinderHeader from "~/components/CourtFinderHeader";
import { getStrapiAmtsgerichtCommon } from "~/services/cms";
import { findEdgeCases } from "~/services/gerichtsfinder/amtsgerichtData.server";

export const loader = async ({ params }: LoaderArgs) => {
  const zipCode = params.PLZ;
  const edgeCases = findEdgeCases({ zipCode });
  if (edgeCases.length == 0) {
    return redirect(`/amtsgericht/${zipCode}`);
  }

  const edgeCasesGroupedByLetter = edgeCases.reduce(
    (acc: { [x: string]: ReturnType<typeof findEdgeCases> }, edgeCase) => {
      (acc[edgeCase.STRN[0]] = acc[edgeCase.STRN[0]] ?? []).push(edgeCase);
      return acc;
    },
    {}
  );

  const common = await getStrapiAmtsgerichtCommon();

  return json({
    zipCode,
    edgeCasesGroupedByLetter,
    common,
    url: `/amtsgericht/ergebnis/${zipCode}`,
  });
};

export default function Index() {
  const { zipCode, edgeCasesGroupedByLetter, common, url } =
    useLoaderData<typeof loader>();

  return (
    <>
      <Background backgroundColor="blue">
        <CourtFinderHeader label={common.featureName}>
          Im Bereich Ihrer Postleitzahl <strong>{zipCode}</strong> sind
          verschiedene Amtsgerichte zuständig. Wohnen Sie in einer dieser
          Straßen?
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
            href="/amtsgericht/suche"
            look="tertiary"
            size="large"
            id="backLink"
          >
            Zurück
          </Button>
          <Button href={`${url}/default`} size="large" id="defaultButton">
            Ich wohne in keiner dieser Straßen
          </Button>
        </ButtonContainer>
      </Container>
    </>
  );
}
