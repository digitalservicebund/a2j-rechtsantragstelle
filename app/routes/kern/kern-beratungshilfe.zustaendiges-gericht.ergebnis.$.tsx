import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { KernIcon } from "~/components/kern/common/KernIcon";
import KernHeading from "~/components/kern/KernHeading";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import { type loader } from "../beratungshilfe.zustaendiges-gericht.ergebnis.$";
import KernCourtDetails from "~/routes/kern/KernCourtDetails";

export const KernZuestandigesGerichErgebnis = () => {
  const { court, content } = useLoaderData<typeof loader>();

  return (
    <>
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
    </>
  );
};

export default KernZuestandigesGerichErgebnis;
