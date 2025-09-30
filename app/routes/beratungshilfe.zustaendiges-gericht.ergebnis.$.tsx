import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import invariant from "tiny-invariant";
import { BACKGROUND_COLORS } from "~/components";
import Heading from "~/components/common/Heading";
import { StandaloneLink } from "~/components/common/StandaloneLink";
import ContentComponents from "~/components/content/ContentComponents";
import CourtDetails from "~/components/CourtDetails";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { fetchPage } from "~/services/cms/index.server";
import {
  edgeCasesForPlz,
  findCourt,
} from "~/services/gerichtsfinder/amtsgerichtData.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");

  const [zipCode, streetSlug, houseNumber] = splat.split("/");
  if (edgeCasesForPlz(zipCode).length > 0 && !streetSlug) {
    return redirect(`/beratungshilfe/zustaendiges-gericht/auswahl/${zipCode}`);
  }

  const court = findCourt({ zipCode, streetSlug, houseNumber });
  if (!court) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const slug = "/beratungshilfe/zustaendiges-gericht/ergebnis";
  const [{ content, pageMeta }] = await Promise.all([fetchPage(slug)]);
  return { court, content, meta: pageMeta };
};

export const Component = () => {
  const { court, content } = useLoaderData<typeof loader>();

  return (
    <GridSection backgroundClass={BACKGROUND_COLORS.blue} pt="48" pb="40">
      <Grid>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          row={1}
        >
          <span className="ds-label-03-reg">Amtsgericht finden</span>
          <Heading tagName="h1" look="ds-heading-02-reg" className="mt-16">
            Ihr zuständiges Amtsgericht
          </Heading>
        </GridItem>
      </Grid>
      <Grid
        className="py-40"
        background={{
          className: `${BACKGROUND_COLORS.white} rounded-lg`,
          mdColumn: { start: 1, span: 8 },
          lgColumn: { start: 2, span: 10 },
          xlColumn: { start: 2, span: 10 },
        }}
      >
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          className="py-24 px-16 md:px-16 lg:px-0 xl:px-0"
        >
          <CourtDetails
            name={court.BEZEICHNUNG}
            street={court.STR_HNR}
            city={`${court.PLZ_ZUSTELLBEZIRK} ${court.ORT}`}
            website={court.URL1}
            phone={court.TEL}
            addressLabel="Adresse"
            websiteLabel="Webseite"
            phoneLabel="Telefonnummer"
          />
        </GridItem>
      </Grid>
      <Grid>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          row={3}
        >
          <StandaloneLink
            text="Suche wiederholen"
            url="/beratungshilfe/zustaendiges-gericht/suche"
          />
        </GridItem>
      </Grid>
      <ContentComponents content={content} />
    </GridSection>
  );
};

export default Component;
