import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Background, Container } from "~/components";
import CourtDetails from "~/components/CourtDetails";
import CourtFinderHeader from "~/components/CourtFinderHeader";
import PageContent from "~/components/PageContent";
import {
  fetchCollectionEntry,
  fetchSingleEntry,
} from "~/services/cms/index.server";
import {
  edgeCasesForPlz,
  findCourt,
} from "~/services/gerichtsfinder/amtsgerichtData.server";
import urlMap from "~/services/gerichtsfinder/data/sanitizedURLs.json";

export const loader = async ({ params }: LoaderArgs) => {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");

  const [zipCode, streetSlug] = splat.split("/");
  if (edgeCasesForPlz(zipCode).length > 0 && !streetSlug) {
    return redirect(`/beratungshilfe/zustaendiges-gericht/auswahl/${zipCode}`);
  }

  let court = undefined;
  try {
    court = findCourt({ zipCode, streetSlug });
  } catch (err) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  invariant(court);

  const slug = "/beratungshilfe/zustaendiges-gericht/ergebnis";
  const [common, { content, meta }] = await Promise.all([
    fetchSingleEntry("amtsgericht-common"),
    fetchCollectionEntry("pages", slug),
  ]);

  if (court.URL1 && court.URL1 in urlMap)
    court.URL1 = urlMap[court.URL1 as keyof typeof urlMap];

  return json({ court, content, meta, common });
};

export const Component = () => {
  const { court, content, common } = useLoaderData<typeof loader>();

  return (
    <>
      <Background backgroundColor="blue">
        <CourtFinderHeader label={common.featureName}>
          {common.resultHeading}
        </CourtFinderHeader>

        <Container backgroundColor="white" overhangingBackground>
          <CourtDetails
            name={court.BEZEICHNUNG}
            street={court.STR_HNR}
            city={`${court.PLZ_ZUSTELLBEZIRK} ${court.ORT}`}
            website={court.URL1}
            phone={court.TEL}
            addressLabel={common.resultAddress}
            websiteLabel={common.resultWebsite}
            phoneLabel={common.resultPhone}
          />
        </Container>
        <Container>
          <a
            href="/beratungshilfe/zustaendiges-gericht/suche"
            className="text-link underline"
            id="backLink"
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
