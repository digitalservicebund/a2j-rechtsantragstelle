import type { Meta, StoryObj } from "@storybook/react";
import Video from "~/components/Video";

const component = Video;

const DIGITAL_SERVICE_GEBAERDENSPRACHE_VIDEO_LINK =
  "https://www.youtube.com/embed/ZZ0o6NFCJeI?si=0LcA1Rmf-RwuauID";
const MOCK_DATENSCHUTZ = {
  markdown: "Pretty please accept our Datenschutz :)",
};

const meta = {
  title: "Component/Video",
  component: component,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof component>;

export const Default = {
  args: {
    title: "Wilkommen Video",
    url: DIGITAL_SERVICE_GEBAERDENSPRACHE_VIDEO_LINK,
    datenschutz: MOCK_DATENSCHUTZ,
  },
} satisfies StoryObj<typeof meta>;

export default meta;
