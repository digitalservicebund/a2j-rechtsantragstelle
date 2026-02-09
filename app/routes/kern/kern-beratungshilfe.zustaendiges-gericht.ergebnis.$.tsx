import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import invariant from "tiny-invariant";
import ContentComponents from "~/components/content/ContentComponents";
import { KernIcon } from "~/components/kern/common/KernIcon";
import KernHeading from "~/components/kern/KernHeading";
import KernCourtDetails from "~/components/KernCourtDetails";
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
  invariant(splat !== undefined);

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
  const { content, pageMeta } = await fetchPage(slug);
  return { court, content, meta: pageMeta };
};

export const KernZuestandigesGerichErgebnis = () => {
  const { court, content } = useLoaderData<typeof loader>();

  return (
    <GridSection pt="48" pb="40">
      <Grid>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          row={1}
        >
          <span>Amtsgericht finden</span>
          <KernHeading
            tagName="h1"
            text="Ihr zuständiges Amtsgericht"
            className="mt-16"
          />
        </GridItem>
      </Grid>
      <Grid
        className="py-40"
        background={{
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
          <KernCourtDetails
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
          <a href="/beratungshilfe/zustaendiges-gericht/suche" className="flex kern-link no-underline!">
          <KernIcon name="arrow-forward"/>
            Suche wiederholen
          </a>
        </GridItem>
      </Grid>
      <ContentComponents content={content} />
    </GridSection>
  );
};

export default KernZuestandigesGerichErgebnis;
