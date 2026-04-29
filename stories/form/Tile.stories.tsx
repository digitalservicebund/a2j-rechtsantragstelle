import { reactRouterFormContext } from "~/../.storybook/reactRouterFormContext";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { GridSection } from "~/components/layout/grid/GridSection";
import img1Url from "../assets/nichtbefoerderung.svg?no-inline";
import img2Url from "../assets/verspaetung.svg?no-inline";
import KernTile from "~/components/formElements/tile/KernTile";

const meta = {
  title: "form/Tile",
  component: KernTile,
  parameters: {
    controls: {
      exclude: ["title", "name"],
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) =>
      reactRouterFormContext(
        <GridSection>
          <Grid>
            <GridItem>
              <Story />
            </GridItem>
          </Grid>
        </GridSection>,
      ),
  ],
} satisfies Meta<typeof KernTile>;

export default meta;

export const WithImageAndTag: StoryObj<typeof meta> = {
  args: {
    name: "tileName",
    errorMessages: undefined,
    options: [
      {
        value: "value1",
        description: "Some random description",
        title: "Some random title",
      },
      {
        value: "value2",
        description: "Some random description",
        title: "Some random title",
        image: { url: img1Url },
      },
      {
        image: { url: img2Url },
        value: "value3",
        description: "Some random description",
        title: "Some random title",
      },
    ],
    useTwoColumns: false,
  },
};
