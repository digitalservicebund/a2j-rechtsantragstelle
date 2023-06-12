import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Background, Button, Container } from "~/components";
import { ButtonContainer } from "~/components/ButtonContainer";
import { findEdgeCases } from "~/services/gerichtsfinder/amtsgerichtData.server";

export const loader = async ({ params }: LoaderArgs) => {
  const zipCode = params.PLZ;
  const edgeCases = findEdgeCases({ zipCode });
  if (edgeCases.length == 0) {
    return redirect(`../amtsgericht/${zipCode}`);
  }

  const edgeCasesGroupedByLetter = edgeCases.reduce(
    (acc: { [x: string]: ReturnType<typeof findEdgeCases> }, edgeCase) => {
      (acc[edgeCase.STRN[0]] = acc[edgeCase.STRN[0]] ?? []).push(edgeCase);
      return acc;
    },
    {}
  );

  return json({
    zipCode,
    edgeCasesGroupedByLetter,
    url: `/amtsgericht/${zipCode}`,
  });
};

export default function Index() {
  const { zipCode, edgeCasesGroupedByLetter, url } =
    useLoaderData<typeof loader>();

  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <div className="ds-stack-24">
            <div className="ds-label-03-reg">Amtsgericht finden</div>
            <h1 className="ds-heading-02-reg">
              Im Bereich Ihrer Postleitzahl <b>{zipCode}</b> sind verschiedene
              Amtsgerichte zuständig. Wohnen Sie in einer dieser Straßen?
            </h1>
          </div>
        </Container>
      </Background>
      <Container paddingTop="48">
        <ul className="list-none pl-0 pt-48 pb-32">
          {edgeCasesGroupedByLetter &&
            Object.entries(edgeCasesGroupedByLetter).map(
              ([firstLetter, edgeCasesForLetter]) => (
                <li key={firstLetter}>
                  <h2 className="ds-label-01-reg p-8 bg-blue-100">
                    {firstLetter}
                  </h2>
                  <ul className="list-none p-8 pb-16">
                    {edgeCasesForLetter.map((edgeCase) => (
                      <li key={edgeCase.streetSlug}>
                        <div>
                          <a
                            href={`${url}/${edgeCase.streetSlug}`}
                            className="font-bold leading-9 underline"
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
          <Button href="#" look="tertiary" size="large">
            Zurück
          </Button>
          <Button href={`${url}/default`} size="large">
            Ich wohne in keiner dieser Straßen
          </Button>
        </ButtonContainer>
      </Container>
    </>
  );
}
