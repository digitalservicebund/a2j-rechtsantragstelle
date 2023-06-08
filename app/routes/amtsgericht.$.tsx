import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button, Container } from "~/components";
import { ButtonContainer } from "~/components/ButtonContainer";
import Header from "~/components/Header";
import {
  findCourt,
  findEdgeCases,
} from "~/services/gerichtsfinder/amtsgerichtData.server";
import type {
  Jmtd14VTErwerberGerbeh,
  Jmtd14VTErwerberPlzstrn,
} from "~/services/gerichtsfinder/types";

type LoaderData = {
  court?: Jmtd14VTErwerberGerbeh;
  edgeCases?: Jmtd14VTErwerberPlzstrn[];
  url?: string;
};

export const loader = async ({ params }: LoaderArgs) => {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");

  const [zipCode, streetSlug] = splat.split("/");

  if (!streetSlug) {
    const edgeCases = findEdgeCases({ zipCode });

    if (edgeCases.length > 0) {
      const groupedEdgeCases = edgeCases.reduce(
        (acc: { [x: string]: Jmtd14VTErwerberPlzstrn[] }, edgeCase) => {
          (acc[edgeCase.STRN[0]] = acc[edgeCase.STRN[0]] ?? []).push(edgeCase);
          return acc;
        },
        {}
      );
      return json({
        edgeCases: groupedEdgeCases,
        url: `/amtsgericht/${zipCode}`,
      });
    }
  }

  const court = findCourt({ zipCode, streetSlug });

  if (court) {
    return json({ court });
  }

  return json(null);
};

export const Component = () => {
  const loaderData = useLoaderData<LoaderData>();
  if (!loaderData) {
    return <div>Kein passendes Amtsgericht gefunden. PLZ überprüfen?</div>;
  }

  if (loaderData.court) {
    const { court } = loaderData;
    return (
      <Container>
        <div>
          <Header
            heading={{
              text: "Zuständiges Gericht",
              tagName: "h2",
              look: "ds-heading-02-reg",
            }}
            content={{
              text: court.BEZEICHNUNG,
            }}
          />
          <div>
            {court.STR_HNR}
            <br />
            {court.PLZ_ZUSTELLBEZIRK} {court.ORT}
            <br />
            Telefon: {court.TEL}
            <br />
            Telefax: {court.FAX}
            <br />
            {court.EMAIL1 && `Email: ${court.EMAIL1}`}
            <br />
            Webseite: {court.URL1}
            <br />
            <br />
          </div>
        </div>
      </Container>
    );
  }

  if (loaderData.edgeCases) {
    return (
      <Container>
        <ul className="list-none pl-0 pt-48 pb-32">
          {Object.entries(loaderData.edgeCases).map(
            ([firstLetter, edgeCases]) => (
              <li key={firstLetter}>
                <h2 className="ds-label-01-reg p-8 bg-blue-100">
                  {firstLetter}
                </h2>
                <ul className="list-none p-8 pb-16">
                  {/*@ts-ignore */}
                  {edgeCases.map((edgeCase) => (
                    <li key={edgeCase.streetSlug}>
                      <div>
                        <a
                          href={`${loaderData.url}/${edgeCase.streetSlug}`}
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
          <Button href={`${loaderData.url}/default`} size="large">
            Ich wohne in keiner dieser Straßen
          </Button>
        </ButtonContainer>
      </Container>
    );
  }
};

export default Component;
