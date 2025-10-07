import { useLoaderData } from "react-router";
import type { loader } from "../visualisierung";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { InlineSvgImage } from "~/components/common/InlineSvgImage";

export function Visualisierung() {
  const { svgString } = useLoaderData<typeof loader>();
  return (
    <GridSection>
      <Grid>
        <GridItem
          smColumn={{ start: 1, span: 12 }}
          mdColumn={{ start: 1, span: 12 }}
          lgColumn={{ start: 1, span: 12 }}
          xlColumn={{ start: 1, span: 12 }}
        >
          <InlineSvgImage svgString={svgString} />
        </GridItem>
      </Grid>
    </GridSection>
  );
}
