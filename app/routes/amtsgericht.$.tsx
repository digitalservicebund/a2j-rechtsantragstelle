import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button, Container } from "~/components";
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
  console.log({ splat, zipCode, streetSlug });

  if (!streetSlug) {
    const edgeCases = findEdgeCases({ zipCode });

    if (edgeCases.length > 0) {
      console.log(edgeCases[0]);
      const groupedEdgeCases = edgeCases.reduce(
        (acc: { [x: string]: Jmtd14VTErwerberPlzstrn[] }, edgeCase) => {
          (acc[edgeCase.STRN[0]] = acc[edgeCase.STRN[0]] ?? []).push(edgeCase);
          return acc;
        },
        {}
      );
      console.log("GROUPED", groupedEdgeCases);
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
        <div>
          <h2>Ausnahmen:</h2>
          <ul>
            {Object.entries(loaderData.edgeCases).map(
              ([firstLetter, edgeCases]) => (
                <li key={firstLetter}>
                  <h2>{firstLetter}</h2>
                  <ul>
                    {/*@ts-ignore */}
                    {edgeCases.map((edgeCase) => (
                      <li key={edgeCase.streetSlug}>
                        <div>
                          <a href={`${loaderData.url}/${edgeCase.streetSlug}`}>
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
        </div>
        <Button href={`${loaderData.url}/default`}>Straße nicht dabei</Button>
      </Container>
    );
  }
};

export default Component;
