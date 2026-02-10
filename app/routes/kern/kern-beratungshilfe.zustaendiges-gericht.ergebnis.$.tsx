import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { KernIcon } from "~/components/kern/common/KernIcon";
import KernHeading from "~/components/kern/KernHeading";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { type loader } from "../beratungshilfe.zustaendiges-gericht.ergebnis.$";
import KernCourtDetails from "~/components/KernCourtDetails";

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

export default KernZuestandigesGerichErgebnis;
