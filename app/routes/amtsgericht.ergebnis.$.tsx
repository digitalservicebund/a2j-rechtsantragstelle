import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Background, Container } from "~/components";
import CourtDetails from "~/components/CourtDetails";
import PageContent from "~/components/PageContent";
import { getStrapiAmtsgerichtCommon, getStrapiPage } from "~/services/cms";
import {
  edgeCasesForPlz,
  findCourt,
} from "~/services/gerichtsfinder/amtsgerichtData.server";

export const meta: V2_MetaFunction<typeof loader> = ({ location, data }) => [
  {
    title: data ? data.metaData.title : location.pathname,
  },
];

export const loader = async ({ params }: LoaderArgs) => {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");

  const [zipCode, streetSlug] = splat.split("/");
  if (edgeCasesForPlz(zipCode).length > 0 && !streetSlug) {
    return redirect(`../amtsgericht/auswahl/${zipCode}`);
  }

  let court = undefined;
  try {
    court = findCourt({ zipCode, streetSlug });
  } catch (err) {
    console.error(err);
    console.error(`Parameters: zipCode=${zipCode}, streetSlug=${streetSlug}`);
  }

  const { content, meta } = await getStrapiPage({
    slug: "amtsgericht/ergebnis",
  });

  const common = await getStrapiAmtsgerichtCommon();
  return json({ court, content, metaData: meta, common });
};

export const Component = () => {
  const { court, content, common } = useLoaderData<typeof loader>();
  if (!court) {
    return <div>Kein passendes Amtsgericht gefunden. PLZ überprüfen?</div>;
  }

  return (
    <>
      <Background backgroundColor="blue">
        <Container>
          <div className="ds-stack-24">
            <div className="ds-label-03-reg">{common.ergebnisLabel}</div>
            <h1 className="ds-heading-02-reg">{common.ergebnisHeading}</h1>
          </div>
        </Container>

        <Container backgroundColor="white" overhangingBackground>
          <CourtDetails
            name={court.BEZEICHNUNG}
            street={court.STR_HNR}
            city={`${court.PLZ_ZUSTELLBEZIRK} ${court.ORT}`}
            website={`https://${court.URL1}`}
            phone={court.TEL}
            addressLabel={common.ergebnisAddress}
            websiteLabel={common.ergebnisWebsite}
            phoneLabel={common.ergebnisTelephone}
          />
        </Container>
        <Container>
          <a
            href="/amtsgericht/suche"
            className="ds-link-02-bold text-black underline"
          >
            {common.repeatSearch}
          </a>
        </Container>
      </Background>
      <PageContent content={content} />
    </>
  );
};

export default Component;
