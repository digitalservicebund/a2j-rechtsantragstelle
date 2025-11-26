import type { Meta, StoryObj } from "@storybook/react-vite";
import KernInfoBox, {
  type KernInfoBoxProps,
} from "~/components/kern/KernInfoBox";
import { bucketUrl } from "~/services/cms/bucketUrl";

const meta = {
  title: "KERN/InfoBox",
  component: KernInfoBox,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KernInfoBox>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  identifier: "default-info-box-id",
  heading: {
    text: "Heading text",
    tagName: "h2",
    look: "ds-heading-03-bold",
  },
  items: [
    {
      id: 10,
      label: { text: "Label", look: "ds-label-01-reg" },
      headline: { text: "Headline", look: "ds-heading-03-reg" },
      image: undefined,
      content: "Lorem **ipsum**\n\n* Lorem ipsum\n* Lorem ipsum",
      buttons: [{ text: "Button 1", look: "tertiary" }, { text: "Button 2" }],
    },
  ],
} satisfies KernInfoBoxProps;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="bg-kern-neutral-500">
        <Story />
      </div>
    ),
  ],
  args: defaultArgs,
};

export const WithImage: Story = {
  decorators: [
    (Story) => (
      <div className="bg-kern-neutral-500">
        <Story />
      </div>
    ),
  ],
  args: {
    ...defaultArgs,
    items: [
      {
        id: 12,
        label: { text: "Label", look: "ds-label-01-reg" },
        headline: { text: "Headline", look: "ds-heading-03-reg" },
        image: {
          url: bucketUrl + "/bmj_logo_3fd953f074.png",
          width: 240,
          height: 132,
          alternativeText: "Logo des Bundesministerium der Justiz",
        },
        content: "Lorem **ipsum**\n\n* Lorem ipsum\n* Lorem ipsum",
        buttons: [
          { text: "Button 1", look: "tertiary" as const },
          { text: "Button 2" },
        ],
      },
    ],
  },
};
