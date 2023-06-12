import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Background, Container } from "~/components";
import CourtDetails from "~/components/CourtDetails";
import {
  edgeCasesForPlz,
  findCourt,
} from "~/services/gerichtsfinder/amtsgerichtData.server";

export const loader = async ({ params }: LoaderArgs) => {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");

  const [zipCode, streetSlug] = splat.split("/");
  if (edgeCasesForPlz(zipCode).length > 0 && !streetSlug) {
    return redirect(`../amtsgerichte/${zipCode}`);
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
  const { court } = useLoaderData<typeof loader>();
  if (!court) {
    return <div>Kein passendes Amtsgericht gefunden. PLZ überprüfen?</div>;
  }

  return (
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
        <a
          href="../amtsgericht/suche"
          className="ds-link-02-bold text-black underline"
        >
          Suche wiederholen
        </a>
      </Container>
    </Background>
  );
};

export default Component;
