import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { fetchPage } from "~/services/cms/index.server";
import {
  edgeCasesForPlz,
  findCourt,
} from "~/services/gerichtsfinder/amtsgerichtData.server";
import { splatFromParams } from "~/services/params";
import { KernIcon } from "~/components/kern/common/KernIcon";
import KernHeading from "~/components/kern/KernHeading";
import CourtDetails from "~/components/CourtDetails";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const [zipCode, streetName, ...houseNumberSplit] =
    splatFromParams(params).split("/");
  const houseNumber = houseNumberSplit.join("/");
  if (edgeCasesForPlz(zipCode).length > 0 && !streetName) {
    return redirect(`/beratungshilfe/zustaendiges-gericht/auswahl/${zipCode}`);
  }

  const court = findCourt({ zipCode, streetName, houseNumber });
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

export const Component = () => {
  const { court, content } = useLoaderData<typeof loader>();

  return (
    <GridSection pt="48" pb="40" className="bg-kern-neutral-025">
      <Grid>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          row={1}
          className="flex flex-col gap-kern-space-default lg:px-kern-space-default"
        >
          <h1 className="text-kern-static-medium text-kern-layout-text-muted!">
            Amtsgericht finden
          </h1>
          <KernHeading
            tagName="h2"
            text="Ihr zuständiges Amtsgericht"
            size="xLarge"
            managedByParent
          />
        </GridItem>
      </Grid>
      <Grid
        className="py-40"
        background={{
          mdColumn: { start: 1, span: 8 },
          lgColumn: { start: 2, span: 10 },
          xlColumn: { start: 2, span: 10 },
          className: "rounded-lg bg-kern-neutral-050",
        }}
      >
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          className="py-kern-space-default lg:px-kern-space-default px-kern-space-small"
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
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          row={2}
          className="py-kern-space-large lg:px-kern-space-default"
        >
          <a
            href="/beratungshilfe/zustaendiges-gericht/suche"
            className="flex kern-link no-underline!"
          >
            <KernIcon name="arrow-forward" />
            Suche wiederholen
          </a>
        </GridItem>
      </Grid>
      <ContentComponents content={content} />
    </GridSection>
  );
};

export default Component;
