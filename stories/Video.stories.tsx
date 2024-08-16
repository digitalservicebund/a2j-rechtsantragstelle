import type { Meta, StoryObj } from "@storybook/react";
import Video from "~/components/Video/Video";

const component = Video;

const DIGITAL_SERVICE_GEBAERDENSPRACHE_VIDEO_LINK =
  "https://www.youtube.com/watch?v=ZZ0o6NFCJeI";

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
  },
} satisfies StoryObj<typeof meta>;

export default meta;
