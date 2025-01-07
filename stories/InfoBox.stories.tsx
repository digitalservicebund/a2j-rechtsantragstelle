import type { Meta, StoryObj } from "@storybook/react";
import Container from "../app/components/Container";
import InfoBox from "~/components/InfoBox";
import { bucketUrl } from "~/services/cms/bucketUrl";

const meta = {
  title: "Content/InfoBox",
  component: InfoBox,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InfoBox>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs = {
  identifier: "default-info-box-id",
  heading: {
    text: "Heading text",
    tagName: "h2" as const,
    look: "ds-heading-03-bold",
  },
  items: [
    {
      label: { text: "Label", look: "ds-label-01-reg" },
      headline: { text: "Headline", look: "ds-heading-03-reg" },
      image: undefined,
      content: "Lorem **ipsum**\n\n* Lorem ipsum\n* Lorem ipsum",
      buttons: [
        { text: "Button 1", look: "tertiary" as const },
        { text: "Button 2" },
      ],
    },
  ],
};

export const Default: Story = {
  args: defaultArgs,
};

export const InContainer: Story = {
  decorators: (Story) => (
    <Container>
      <Story />
    </Container>
  ),
  args: defaultArgs,
};

export const WithImage: Story = {
  args: {
    ...defaultArgs,
    items: [
      {
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
