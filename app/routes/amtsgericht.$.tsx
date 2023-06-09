import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Background, Button, Container } from "~/components";
import { ButtonContainer } from "~/components/ButtonContainer";
import CourtDetails from "~/components/CourtDetails";
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
  zipCode?: string;
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
        zipCode,
      });
    }
  }

  let court = undefined;
  try {
    court = findCourt({ zipCode, streetSlug });
  } catch (err) {
    console.error(err);
    console.error(`Parameters: zipCode=${zipCode}, streetSlug=${streetSlug}`);
  }
  return json({ court });
};

export const Component = () => {
  const { court, edgeCases, url, zipCode } = useLoaderData<LoaderData>();
  if (!court && !edgeCases) {
    return <div>Kein passendes Amtsgericht gefunden. PLZ überprüfen?</div>;
  }

  if (court) {
    return (
      <div>
        <Background backgroundColor="blue">
          <Container>
            <div className="ds-stack-24">
              <div className="ds-label-03-reg">Amtsgericht finden</div>
              <h1 className="ds-heading-02-reg">Ihr zuständiges Amtsgericht</h1>
            </div>
          </Container>

          <Container backgroundColor="white" overhangingBackground>
            <CourtDetails
              name={court.BEZEICHNUNG}
              street={court.STR_HNR}
              city={`${court.PLZ_ZUSTELLBEZIRK} ${court.ORT}`}
              website={`https://${court.URL1}`}
              phone={court.TEL}
              addressLabel="Adresse"
              websiteLabel="Website"
              phoneLabel="Telefonnummer"
            />
          </Container>
          <Container>
            <a href="#" className="ds-link-02-bold text-black underline">
              Suche wiederholen
            </a>
          </Container>
        </Background>
      </div>
    );
  }

  if (edgeCases) {
    return (
      <div>
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
          <ul className="list-none pl-0 pb-32">
            {Object.entries(edgeCases).map(([firstLetter, edgeCases]) => (
              <li key={firstLetter} className="max-w-none">
                <h2 className="ds-label-01-reg p-8 bg-blue-100 max-w-none">
                  {firstLetter}
                </h2>
                <ul className="list-none p-8 pb-16">
                  {/*@ts-ignore */}
                  {edgeCases.map((edgeCase) => (
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
            ))}
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
      </div>
    );
  }
};

export default Component;
