import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Background from "~/components/Background";
import Container from "~/components/Container";
import CourtDetails from "~/components/CourtDetails";
import CourtFinderHeader from "~/components/CourtFinderHeader";
import PageContent from "~/components/PageContent";
import { fetchPage, fetchTranslations } from "~/services/cms/index.server";
import {
  edgeCasesForPlz,
  findCourt,
} from "~/services/gerichtsfinder/amtsgerichtData.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");

  const [zipCode, streetSlug] = splat.split("/");
  if (edgeCasesForPlz(zipCode).length > 0 && !streetSlug) {
    return redirect(`/beratungshilfe/zustaendiges-gericht/auswahl/${zipCode}`);
  }

  const court = findCourt({ zipCode, streetSlug });
  if (!court) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const slug = "/beratungshilfe/zustaendiges-gericht/ergebnis";
  const [common, { content, meta }] = await Promise.all([
    fetchTranslations("amtsgericht"),
    fetchPage(slug),
  ]);

  return { court, content, meta, common };
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
