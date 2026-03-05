import type { Meta, StoryObj } from "@storybook/react-vite";
import { reactRouterFormContext } from "../.storybook/reactRouterFormContext";
import TileGroup from "~/components/formElements/tile/TileGroup";
import Container from "~/components/layout/Container";
import img1Url from "./assets/nichtbefoerderung.svg?no-inline";
import img2Url from "./assets/verspaetung.svg?no-inline";

const meta = {
  title: "FormElements/TileGroup",
  component: TileGroup,
  parameters: {
    controls: {
      exclude: ["title", "name"],
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => <Container>{reactRouterFormContext(<Story />)}</Container>,
  ],
} satisfies Meta<typeof TileGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithImageAndTag: Story = {
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
        tagDescription: "Tag description",
      },
    ],
    useTwoColumns: false,
  },
};
